/**
 * Created by xiaos on 16/12/22.
 */
const postData = PostsCollection.find()

console.log(postData)

Template.postsList.helpers({
    posts:postData
})

Template.postItem.helpers({
    domain(){
        const a = document.createElement('a')
        a.href = this.url
        return a.hostname
    }
})

