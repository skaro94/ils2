import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts'; 

import { Links } from './collection';
 
if (Meteor.isServer) {
  Meteor.publish('links', function(options, searchString) {
    const selector = {
      $or: [{
        // the public links
        $and: [{
          public: true
        }, {
          public: {
            $exists: true
          }
        }]
      }, {
        // when logged in user is the owner
        $and: [{
          owner: this.userId
        }, {
          owner: {
            $exists: true
          }
        }]
      }]
    };

    if (typeof searchString === 'string' && searchString.length) {
      selector.name = {
        $regex: `.*${searchString}.*`,
        $options : 'i'
      };
    }

    Counts.publish(this, 'numberOfLinks', Links.find(selector), {
      noReady:true
    })
 
    return Links.find(selector, options);
  });
}