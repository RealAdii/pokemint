// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TaskEscrow {
    address public owner;

    struct Task {
        address token;
        address sender;
        address recipient;
        uint256 amount;
        bool isCompleted;
    }

    // Mapping from task ID to Task details
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 taskId, address indexed sender, address indexed recipient, uint256 amount);
    event TaskCompleted(uint256 taskId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new task and lock funds for the task
     * @param _token The address of the ERC20 token
     * @param _recipient The address of the task recipient
     * @param _amount The amount of tokens to lock
     * @return taskId The ID of the created task
     */
    function createTask(address _token, address _recipient, uint256 _amount) external returns (uint256 taskId) {
        require(_amount > 0, "Amount must be greater than zero");
        IERC20 token = IERC20(_token);
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        taskId = taskCount++;
        tasks[taskId] = Task({
            token: _token,
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            isCompleted: false
        });

        emit TaskCreated(taskId, msg.sender, _recipient, _amount);
    }

    /**
     * @dev Complete a task and release funds to the recipient
     * @param _taskId The ID of the task to complete
     */
    function completeTask(uint256 _taskId) external onlyOwner {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        require(task.amount > 0, "Task does not exist");

        task.isCompleted = true;
        IERC20 token = IERC20(task.token);
        require(token.transfer(task.recipient, task.amount), "Token transfer failed");

        emit TaskCompleted(_taskId);
    }

    /**
     * @dev Get details of a specific task
     * @param _taskId The ID of the task to query
     * @return Task details
     */
    function getTask(uint256 _taskId) external view returns (address, address, address, uint256, bool) {
        Task storage task = tasks[_taskId];
        return (task.token, task.sender, task.recipient, task.amount, task.isCompleted);
    }
}
