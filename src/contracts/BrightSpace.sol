pragma solidity >=0.4.21 <0.6.0;


contract BrightSpace{

    string public name;

    uint public postCount = 0;

    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string name;
        string content;
        uint tip;
        address payable author;
    }
    
    event PostCreated (
        uint id,
        string name,
        string content,
        uint tip,
        address payable author
    );

    event PostTipped (
        uint id,
        string name,
        string content,
        uint tip,
        address payable author
    );

    constructor() public 
    {
        name = "Bright space for your thoughts";
    }

    function createPost( string memory _name, string memory _content) public {
        require(bytes(_content).length > 0 && bytes(_name).length > 0);
        postCount ++;
        posts[postCount] = Post(postCount, _name, _content, 0, msg.sender);
        emit PostCreated(postCount, _name,_content,0,msg.sender);
    }

    function tipPost(uint _id) public payable {
        require(_id > 0 && _id <= postCount);
        Post memory _post = posts[_id];
        address payable _author = _post.author;
        address(_author).transfer(msg.value);
        _post.tip = _post.tip + msg.value;
        posts[_id]=_post;
        emit PostTipped(postCount, _post.name, _post.content, _post.tip, _author);

    }
}