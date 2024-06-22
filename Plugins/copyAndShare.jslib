mergeInto(LibraryManager.library, 
{
    CopyAndShare: function(targetText) 
    {
        const text = UTF8ToString(targetText);

        function copyToClipboard(text) 
        {
            if (navigator.clipboard && navigator.clipboard.writeText) 
            {
                navigator.clipboard.writeText(text)
                    .then(() => 
                    {
                        console.debug("Text copied to the clipboard: " + text);
                    })
                    .catch((error) => 
                    {
                        console.error("Failed to copy to clipboard", error);
                    });
            } 
            else 
            {
                fallbackCopyToClipboard(text);
            }
        }

        function fallbackCopyToClipboard(text) 
        {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try 
            {
                const isSuccessful = document.execCommand('copy');
                const message = isSuccessful ? 'success' : 'failed';

                console.debug('Alternate method: The text copy command was ' + message);
            } 
            catch (error) 
            {
                console.error('Alternate method: Failed to copy', error);
            }

            document.body.removeChild(textArea);
        }

        function shareText(text) 
        {
            if (navigator.share) 
            {
                navigator.share(
                    {
                        title: 'Share it!',
                        text: text
                    })
                    .then(() =>
                    {
                        console.debug("The share option was successfully executed");
                    })
                    .catch((error) => 
                    {
                        console.error("Error when trying to share", error);
                    });
            }
        }

        function isMobileOrTablet() 
        {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        }

        function isCanShare() 
        {
            return navigator.share !== undefined;
        }

        function isTelegramWebView()
        {
            return window.TelegramWebview !== undefined;
        }

        copyToClipboard(text);

        if (isMobileOrTablet() && isCanShare() || isTelegramWebView()) 
        {
            shareText(text);
        }
    }
});