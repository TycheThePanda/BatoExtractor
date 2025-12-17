    const LINE_MARKER = "\uF1DA"; // Latest chapter symbol
    let parsedResults = []; // Global storage for download

    function handleSubmit() {
        const userEntry = document.getElementById("userEntry").value;
        processText(userEntry);
    }

    function processText(userText) {
        const lines = userText
            .split("\n")
            .map(l => l.trim())
            .filter(l => l !== "");

        // Step 1: Extract all titles, default latestChapter to "Unread"
        const entries = extractAllTitles(lines);

        // Step 2: Attach latest chapters from LINE_MARKER
        attachLatestChapters(lines, entries);

        // Step 3: Display in output
        parsedResults = entries; // store globally
        document.getElementById("output").innerText = sectionsToText(entries);
        
        if (entries.length > 0){
            document.getElementById("downloadBtn").style.display = "inline-block";
        }
    }

    // Extract repeated lines as titles
    function extractAllTitles(lines) {
        const titles = [];
        for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i] === lines[i + 1]) {
                titles.push({
                    title: lines[i],
                    latestChapter: "Unread"
                });
                
                i++; // skip next line to avoid duplicate
            }
        }
      return titles;
    }

    // Attach latest chapters using LINE_MARKER
    function attachLatestChapters(lines, entries) {
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(LINE_MARKER)) {
                const latestChapter = lines[i].slice(LINE_MARKER.length).trim();
                const title = findTitleBefore(lines, i);
                const entry = entries.find(e => e.title === title);
                if (entry) entry.latestChapter = latestChapter;
            }
        }
    }

    // Find the most recent repeated line before a chapter marker
    function findTitleBefore(lines, index) {
        for (let i = index - 1; i >= 1; i--) {
            if (lines[i] === lines[i - 1]) return lines[i];
        }
        
        return null;
    }

    // Convert sections to display string
    function sectionsToText(sections) {
        return sections.map(s => `"${s.title}",${s.latestChapter}`).join("\n");
    }

    // Download results as TXT file
    function downloadResults(filename = "series.csv") {
        if (!parsedResults || parsedResults.length === 0) {
            alert("No parsed data to download!");
            return;
        }

        const text = sectionsToText(parsedResults);
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }