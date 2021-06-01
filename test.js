const test = require('ava')
const testTweets = require('./test-tweets.json')
const getReplyText = require('./get-repy-text')

const noAltText = "There is no alt text for this image, perhaps try again with a different image"
const video = "Whoops. It appears you are attempting to read alt text of a video. Twitter does not allow useres to add alt text for videos/gifs."

text('classic flow, with alt text', async (t) => {
    const reply = getReplyText(testTweets[1])
    t.is(
        await reply,
        'On Saturday, November 1, 1800, John Adams became the first president to take residence in the @WhiteHouse.'
    )
})

test('classic flow, no alt text', async (t) => {
    const reply = getReplyText(testTweets[2])
    t.is(await reply, `@POTUS ${noAltText}`)
})

test('triggering = original, with alt', async (t) => {
    const reply = getReplyText(testTweets[3])
    t.is(
        await reply,
        `The first tweet from @jack was "just setting up my twttr"`
    )
})

test('image in quote, no alt text', async (t) => {
    const reply = getReplyText(testTweets[4])
    t.is(await reply, '@JoeBiden ${noAltText}')
})

test('reply, but no image anywhere', async (t) => {
    const reply = getReplyText(testTweets[5])
    t.is(await reply, undefined)
})

test('image in triggering as well as original', async (t) => {
    const reply = getReplyText(testTweets[6])
    t.is(
        await reply,
        '@VP here is my new VP official portrait, taken by the very talented photographer inside the Map Room at the @WhiteHouse'
    )
})

test('tweet by bot itself', async (t) => {
    const reply = getReplyText(testTweets[7])
    t.is(await reply, undefined)
})

test('video', async (t) => {
    const reply = getReplyText(testTweets[8])
    t.is(await reply, `@VP ${video}`)
})