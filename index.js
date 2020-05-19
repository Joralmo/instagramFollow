const ig = require('instagram-scraping');
const _ = require('lodash');
const request = require('request');

ig.scrapeTag('cars').then(result => {
    let posts = _.orderBy(result.medias, ['like_count', 'comment_count'], ['desc', 'desc']);
    let i = 0, limit = posts.length;
    let post;
    const interval = setInterval(async () => {
        post = posts[i++];
        console.log({
            username: await getUsername(post.owner_id),
            likes: post.like_count,
            comments: post.comment_count
        });
        if (i == limit) clearInterval(interval);
    }, 1500);
});

const getUsername = async function (owner_id) {
    var options = {
        url: `https://i.instagram.com/api/v1/users/${owner_id}/info/`,
        headers: {
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)' //userAgents[Math.floor(Math.random() * (29 - 0) + 0)]
        }
    };
    return new Promise((resolve, _) => {
        request(options, function (_, __, body) {
            const res = JSON.parse(body);
            const { user } = res;
            resolve(user.username ? user.username : null);
        });
    })
}
