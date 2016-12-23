/**
 * Created by xiaos on 16/12/22.
 */

Meteor.publish('posts', ()=>PostsCollection.find())

Meteor.publish("userData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'other': 1, 'things': 1}});
});

Meteor.publish("allUserData", function () {
    return Meteor.users.find({}, {fields: {'nested.things': 1}});
});