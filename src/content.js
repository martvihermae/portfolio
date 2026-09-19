// Content shown in the dialog for each POI letter defined in map.js MAP_LAYOUT.
export const POI_CONTENT = {
    C: {
        title: 'CV / Resume',
        body: `
            <p>A short summary of my experience goes here.</p>
            <p><a href="/cv.pdf" target="_blank" rel="noopener">Download my full CV</a></p>
        `,
    },
    S: {
        title: 'Skills',
        body: `
            <ul>
                <li>JavaScript / TypeScript</li>
                <li>PixiJS / Canvas</li>
                <li>Node.js</li>
            </ul>
        `,
    },
    P: {
        title: 'Portfolio',
        body: `
            <p>Selected projects:</p>
            <ul>
                <li>Project one - description</li>
                <li>Project two - description</li>
            </ul>
        `,
    },
};
