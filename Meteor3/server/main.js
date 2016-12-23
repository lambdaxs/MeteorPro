import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  if (PostsCollection.find().count() === 0){
      PostsCollection.insert({
              title:'今天特价干烧水煮鱼',
              url:'http://www.baidu.com'
          })
      PostsCollection.insert({
              title:'垃圾和合谷',
              url:'http://www.baidu.com'
          })
      PostsCollection.insert({
          title:'大展身手的Meteor',
          url:'http://www.baidu.ocm'
      })
  }
})
