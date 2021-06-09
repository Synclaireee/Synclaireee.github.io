function capitalizeWord(word){
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
function capitalizeWords(words){
    if(!words) return;
    words = words.split(" ").map(word=>{
        return capitalizeWord(word);
    });
    return removeHyphenAndCapitalize(words.join(" "))
}

function removeHyphenAndCapitalize(words){
    if(!words) return;
    words = words.split("-").map(word=>{
        return capitalizeWord(word);
    });
    return words.join(" ")
}
export {
    capitalizeWords,
    removeHyphenAndCapitalize
}