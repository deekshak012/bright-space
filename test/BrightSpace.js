const { assert } = require('chai');

const BrightSpace = artifacts.require("./BrightSpace.sol");//json file

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract( 'BrightSpace', ([deployer,author,tipper])=>
{
    let brightSpace

    before(async()=>
    {
            brightSpace = await BrightSpace.deployed()
    })

    describe('deployment', async ()=>
    {
        it('deploys successfully', async ()=>{
            const address = await brightSpace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)

        })

        it('deploys successfully', async ()=>{
            const name = await brightSpace.name()
            assert.equal(name,'Bright space for your thoughts')

        })

    })

    describe('posts', async ()=> {
        let result
        let postCount
        before(async()=>
        {
            result = await brightSpace.createPost('First Post', 'This is the first post',{from: author});
            postCount = await brightSpace.postCount();
        })

        it('creates posts', async ()=>{
           
            assert.equal(postCount ,1);
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.name,'First Post','name is correct')
            assert.equal(event.content, 'This is the first post', 'content is correct')
            assert.equal(event.tip, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            await brightSpace.createPost('', '',{from: author}).should.be.rejected;
            await brightSpace.createPost('', 'This is the first post',{from: author}).should.be.rejected;
            await brightSpace.createPost('First Post', '',{from: author}).should.be.rejected; 
        })

        it('lists posts', async ()=>{
            const post = await brightSpace.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.name,'First Post','name is correct')
            assert.equal(post.content, 'This is the first post', 'content is correct')
            assert.equal(post.tip, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })

        it('allow users to tip posts', async ()=>{
            let oldBalance
            oldBalance = await web3.eth.getBalance(author)
            oldBalance = new web3.utils.BN(oldBalance)

            result = await brightSpace.tipPost(postCount , { from: tipper, value: web3.utils.toWei('1','Ether') })

            assert.equal(postCount ,1);
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.name,'First Post','name is correct')
            assert.equal(event.content, 'This is the first post', 'content is correct')
            assert.equal(event.tip, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            let newBalance
            newBalance = await web3.eth.getBalance(author)
            newBalance = new web3.utils.BN(newBalance)

            let tip
            tip = await web3.utils.toWei('1','Ether')
            tip = new web3.utils.BN(tip)

            const actualAmount = oldBalance.add(tip)

            assert.equal(newBalance.toString(),actualAmount.toString())

            await brightSpace.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })

})