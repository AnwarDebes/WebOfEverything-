document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.getElementById('search-dropdown');
    
    dropdown.addEventListener('change', function () {
        console.log("Language selected:", dropdown.value);
    });
});

// Function to handle text translation using the Apertium API
async function getTranslatedText(text, langPair) {
    const supportedPairs = await getSupportedLanguagePairs();

    // Split the langPair to source and target languages
    const [sourceLanguage, targetLanguage] = langPair.split('|');

    // Check if the selected langPair is in the list of supported pairs
    const isSupported = supportedPairs.some(pair => pair.sourceLanguage === sourceLanguage && pair.targetLanguage === targetLanguage);

    if (!isSupported) {
        console.error(`Language pair ${langPair} is not supported.`);
        return `Language pair ${langPair} is not supported.`;
    }

    const url = `https://apertium.org/apy/translate?langpair=${encodeURIComponent(langPair)}&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Translation API Response:', data);

        // Check the actual structure of the API response
        if (data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            console.error('Translation error:', data);
            return text;  // Fallback to original text if translation fails
        }
    } catch (error) {
        console.error('Error fetching translation:', error);
        return text;  // Fallback to original text on error
    }
}

// Function to fetch available language pairs from the Apertium API
async function getSupportedLanguagePairs() {
    const url = `https://apertium.org/apy/listPairs`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('Supported language pairs:', data.responseData);
        return data.responseData; // List of language pairs
    } catch (error) {
        console.error('Error fetching supported language pairs:', error);
        return [];
    }
}
