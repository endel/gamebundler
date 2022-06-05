//
// file-loader extensions
//

// (image)
declare module '*.png' { const path: string; export default path; };
declare module '*.webp' { const path: string; export default path; };
declare module '*.jpg' { const path: string; export default path; };
declare module '*.jpeg' { const path: string; export default path; };
declare module '*.svg' { const path: string; export default path; };
// (audio)
declare module '*.aiff' { const path: string; export default path; };
declare module '*.wav' { const path: string; export default path; };
declare module '*.ac3' { const path: string; export default path; };
declare module '*.mp3' { const path: string; export default path; };
declare module '*.mp4' { const path: string; export default path; };
declare module '*.m4a' { const path: string; export default path; };
declare module '*.ogg' { const path: string; export default path; };
declare module '*.opus' { const path: string; export default path; };
declare module '*.webm' { const path: string; export default path; };
// (misc)
declare module '*.xml' { const path: string; export default path; };


// vite-inspired ()
declare module '*?raw' { const src: string; export default src }