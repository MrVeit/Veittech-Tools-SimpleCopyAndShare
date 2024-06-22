using System.Runtime.InteropServices;
using UnityEngine;
using UnityEditor;

namespace Veittech.Utility.SimpleCopyAndShare
{
    [SelectionBase]
    [DisallowMultipleComponent]
    [HelpURL("https://github.com/MrVeit/Veittech-Tools-Simple-Copy-and-Share")]
    public sealed class SimpleCopyAndShare : MonoBehaviour
    {
        [DllImport("__Internal")]
        private static extern void CopyAndShare(string targetText);

        private static readonly object _lock = new();
        private static SimpleCopyAndShare _instance;

        public static SimpleCopyAndShare Instance
        {
            get
            {
                if (_instance)
                {
                    return _instance;
                }

                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = FindObjectOfType<SimpleCopyAndShare>();
                    }
                }

                return _instance;
            }
        }

        private void Awake()
        {
            Init();
        }

        private void Init()
        {
            lock (_lock)
            {
                if (_instance == null)
                {
                    _instance = this;

                    DontDestroyOnLoad(gameObject);

                    return;
                }

                Debug.LogError($"[Simple Copy-And-Share] Another instance is detected on the scene, running delete...");

                Destroy(gameObject);
            }
        }

        public void Share(string targetText)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            CopyAndShare(targetText);

            Debug.Log($"[Simple Copy-And-Share] Text successfully copied to the clipboard: {targetText}");
#else
            EditorGUIUtility.systemCopyBuffer = targetText;

            Debug.LogWarning("[Simple Copy-And-Share] The option SHARE is only supported in the WebGL builds");
#endif
        }
    }
}