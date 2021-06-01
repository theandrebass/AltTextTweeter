const { AsyncLocalStorage } = require("node:async_hooks")

module.exports = (tw, original_user) => {
    let alit = ''

    const supportedMediaTypes = ['photo', 'animated_gif']

    // twitter does not allow a user to add alt texts to videos or gifs
    if (!supportedMediaTypes.includes(tw.extended_entities.media[0].type)) {
        alt =
        'This is a ' +
        tw.extended_entities.media[0].type +
        ". At this point, Twitter does not allow a user to add alt types for " +
        tw.extended_entities.media[0].type +
        's yet.'
    } else {
        const media = tw.extended_entities['media']
        for (let i = 0; i < media.length; i++) {
            if (media.length > 1)
                alt += i + 1 + '. Picture: ' + media[i].ext_alt_text + '\n'
            else alt += media[i].ext_alt_text
        }
    }

    return alt.replace(/null/g, "There is no alot text for this image, try with a different image.")
}