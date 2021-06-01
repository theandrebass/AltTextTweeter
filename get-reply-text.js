const getTweet = require('./get-tweet')
const read = require('./read-alt-text')

module.exports = (tweet) => {
    return new Promise(async (resolve) => {
        try {
            if (!tweet) {
                console.log('This should not happen')
                throw 'No tweet found'
            }

            // do not reply to retweets
            if (typeof tweet.retweeted_status !== 'undefined') {
                resolve()
            }

            const mentioning_id = tweet.id_str
            const mentioning_user = tweet.user.screen_name
            let original_id = tweet.in_reply_to_status_id_str
            let original_user = tweet.in_reply_to_screen_name

            // this is for people posting the picture and triggering the bot within the same tweet
            if (original_id == null) {
                original_id = mentioning_id
                original_user = mentioning_user
            }

            // this is so no infinite loops occur!
            if(mentioning_user == 'get_altText') {
                resolve()
            }

            const original_tweet = await getTweet(original_id)

            // this is to read any media in the original tweet
            if (
                original_tweet.extended_entities &&
                original_tweet.extended_entities['media']
            ) {
                content += read(original_tweet, original_user)
                resolve(content)
            }

            // this is for the media in the triggering tweet
            if (tweet.extended_entities && tweet.extended_entities['media']) {
                content += read(tweet, mentioning_user)
                resolve(content)
            }

            // this is if the tweet is a quoted tweet
            if (tweet.is_quote_status) {
                const quoted_tweet = await getTweet(tweet.quoted_status_id_str)
                // if there is media in the quoted tweet
                if (
                    quoted_tweet.extended_entities &&
                    quoted_tweet.extended_entities['media']
                ) {
                    content += read(quoted_tweet, quoted_tweet.user.screen_name)
                    resolve(content)
                } else {
                    // no media was found in quoted tweet, thus, there will be no tweet
                    resolve()
                }
            }

            resolve()
        } catch (err) {
            console.log(err)
            resolve(
                content + 'There has been an error while trying to read the alt text, please try again  later, - @onlyandrebass, you should probally look into this!'
            )
        }
    })
}