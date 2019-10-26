const FLibra = artifacts.require('./FLibra');

//import chai and chai as promised
require('chai')
  .use(require('chai-as-promised'))
  .should() 
 
contract('FLibra', ([deployer, user1, user2, user3, user4]) => {
  
  //fetch flibra contract before each async function
  beforeEach(async () => {
    flibra = await FLibra.new()
  })

  describe('test flibra contract', async() => {
    let result
    let itemName = "Item 1"
    let itemPrice = 10
    let itemName2 = "Item 2"
    let itemPrice2 = 15

    beforeEach(async() => {
      result = await flibra.setItem(itemName, itemPrice, {from: user1})
      await flibra.setItem(itemName2, itemPrice2, {from: user2})
      await flibra.setItem("Item 3", 15, {from: user1})
    })

    it('emits a post item event', async () => {
      const log = result.logs[0]
      log.event.should.eq(('PostItem'))
      const event = log.args
      event.itemName.should.equal(itemName, 'item name is correct')
      event.price.toString().should.equal(itemPrice.toString(), 'item price is correct')
    })

    it('get my item id', async () => {
      result = await flibra.getMyItemId(user1, { from: user1 })
      result.toString().should.equal([0, 2].toString(), 'user1 item id is correct')
    })

    it('get my posted item', async () => {
      result = await flibra.getMyItemId(user1, { from: user1 })
      result = await flibra.getMyItem(result[0], { from: user1 })
      result.itemName.should.equal(itemName, 'item name is correct')
      result.price.toString().should.equal(itemPrice.toString(), 'item price is correct')
      result.selling.toString().should.equal("true", 'selling is true' )
    })

    it('get all posted item', async () => {
      // tset for first item
      result = await flibra.getAllItem(0, { from: user1 })
      result.itemName.should.equal(itemName, 'item name is correct')
      result.price.toString().should.equal(itemPrice.toString(), 'item price is correct')
      result.selling.toString().should.equal("true", 'selling is true' )

      //test for secound item
      result = await flibra.getAllItem(1, { from: user1 })
      result.itemName.should.equal(itemName2, 'item name is correct')
      result.price.toString().should.equal(itemPrice2.toString(), 'item price is correct')
      result.selling.toString().should.equal("true", 'selling is true' )
    })

    it('get number of item', async () => {
      result = await flibra.getNumberOfItem()
      result.toString().should.equal("3")
    })

    // it('test', async () => {
    //   result = await flibra.getOnSaleItemsId(Boolean("true"))
    //   await console.log(result)
    // })

    describe('purchase item', () => {
      beforeEach(async() => {
        result = await flibra.purchaseItem(1, {from: user3})
      })

      it('emits a purchase item event', async () => {
        const log = result.logs[0]
        log.event.should.eq(('ItemPurchased'))
        const event = log.args
        event.id.toString().should.equal("1", 'item id is correct')
        event.purchaser.should.equal(user3, 'purchaser is correct')
      })

      it('selling status changed', async () => {
        result = await flibra.getAllItem(1, { from: user1 })
        //console.log(result.selling)
        expect(result.selling).to.be.false
      })

      it('list of purchased item id', async () => {
        result = await flibra.getMyPurchasedItemId(user3, {from: user3} )
        result[0].toString().should.equal("1", 'item id is correct')
      })

    })

    describe('edit item', () => {
      itemName = "Item 2-2"
      itemPrice = 20
      
      it('successfully edited', async () => {
        result = await flibra.editItem(1, itemName, itemPrice, {from: user2})
        const log = result.logs[0]
        log.event.should.eq(('EditItem'))
        const event = log.args
        event.id.toString().should.equal("1", 'item id is correct')
        event.itemName.should.equal(itemName, 'edited item name is correct')
        event.price.toString().should.equal(itemPrice.toString(), 'edited item price is correct')
      })
    })

    describe('user function', async () => {
      let userName1 = "Mr. FLibra"
      let userIcon1 = "QmTjzYr14n12YAB4bEMj2fEKcNL3G2TBtBKNxFCRe2Bxtg"

      beforeEach(async() => {
        
        result = await flibra.setUserInfo(userName1, userIcon1, {from: user1})
      })
  
      it('emits user created event', async () => {
        const log = result.logs[0]
        log.event.should.eq(('UserInfoCreated'))
        const event = log.args
        event.userAddress.should.equal(user1, 'user address is correct')
        event.userName.should.equal(userName1, 'user name is correct')
        event.userIcon.should.equal(userIcon1, 'user icon address is correct')
      })

      it('facilitates get user info function', async () => {
        result = await flibra.getUserInfo(user1)
        result.userAddress.should.equal(user1, 'user address is correct')
        result.userName.should.equal(userName1, 'user name is correct')
        result.userIcon.should.equal(userIcon1, 'user icon address is correct')
      })

    })

    describe('Facilitates Review Function', async () => {
      beforeEach(async() => {
        let id
        let star
        let text
        result = await flibra.purchaseItem(2, {from: user3}) //User1 is seller of Itemid 2
      })

      it('write review to seller(user1) from purcasher(user3)', async () => {
        id = 2
        star = 9
        text = "Good seller, I strogry reccomend that you buy something from this seller"
        result = await flibra.writeReviewToSeller(id, star, text, {from: user3})
        const log = result.logs[0]
        log.event.should.eq(('WriteReviewToSeller'))
        const event = log.args
        event.itemId.toString().should.equal(id.toString(), 'item id is correct')
        event.star.toString().should.equal(star.toString(), 'star is correct')
        event.text.should.equal(text, 'text is correct')
      })

      it('Reject if item have not sold yet', async () => {
        result = await flibra.writeReviewToSeller(1, star, text, {from: user3}).should.be.rejected
      })

      it('Reject if writer is not purchaser', async () => {
        result = await flibra.writeReviewToSeller(id, star, text, {from: user1}).should.be.rejected
      })

      it('write review to purcasher(user3) from seller(user1)', async () => {
        id = 2
        star = 8
        text = "Good purchaser!! Don't worry buying items to this purchaser"
        result = await flibra.writeReviewToPurchaser(id, star, text, {from: user1})
        const log = result.logs[0]
        log.event.should.eq(('WriteReviewToPurchaser'))
        const event = log.args
        event.itemId.toString().should.equal(id.toString(), 'item id is correct')
        event.star.toString().should.equal(star.toString(), 'star is correct')
        event.text.should.equal(text, 'text is correct')
      })

      it('Reject if item have not sold yet', async () => {
        result = await flibra.writeReviewToPurchaser(1, star, text, {from: user1}).should.be.rejected
      })

      it('Reject if writer is not purchaser', async () => {
        result = await flibra.writeReviewToPurchaser(id, star, text, {from: user3}).should.be.rejected
      })

    })

  })



})