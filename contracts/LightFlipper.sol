pragma solidity ^0.4.19;

contract LightFlipper {
    enum State { Active, Paused, Inactive }
    State state;

    address public controller;
    modifier onlyController() {
        require(msg.sender == controller);
        _;
    }

    bool public flipped;

    mapping(address => bool) public flippingRights;
    mapping(address => uint) pendingWithdrawals;

    event BoughtFlippingRights(address who);
    event RevokedFlippingRights(address who);
    event FlippedLight(address who, bool newState);

    function LightFlipper() public {
        controller = msg.sender;
        state = State.Active;
    }

    function buyFlippingRights() public payable {
        require(state != State.Inactive);
        require(!flippingRights[msg.sender]);
        require(msg.value >= 0.5 ether);

        flippingRights[msg.sender] = true;

        BoughtFlippingRights(msg.sender);
    }

    function revokeFlippingRights() public {
        require(flippingRights[msg.sender]);
        // check if sender has revoked rights so many times that he could overflow his pending withdrawals
        require(pendingWithdrawals[msg.sender] + 0.25 ether > pendingWithdrawals[msg.sender]);

        flippingRights[msg.sender] = false;
        // recompensate half of the funds
        pendingWithdrawals[msg.sender] += 0.25 ether;

        RevokedFlippingRights(msg.sender);
    }

    function withdraw() public {
        require(pendingWithdrawals[msg.sender] > 0);

        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;

        msg.sender.transfer(amount);
    }

    function flip() public {
        require(state == State.Active);
        require(msg.sender == controller || flippingRights[msg.sender]);

        flipped = !flipped;

        FlippedLight(msg.sender, flipped);
    }

    function changeState(State _state) public onlyController {
        state = _state;
    }

    function changeController(address _controller) public onlyController {
        controller = _controller;
    }

    function stealTheMoney() public onlyController {
        // oups
        selfdestruct(msg.sender);
    }
}
