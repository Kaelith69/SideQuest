# SideQuest Wiki

Welcome to the SideQuest documentation! This wiki provides comprehensive information about using, developing, and deploying SideQuest.

## 📚 Documentation Index

### Getting Started
- **[Home](Home.md)** - Overview and introduction to SideQuest
- **[Installation Guide](Installation-Guide.md)** - Set up SideQuest locally
- **[FAQ](FAQ.md)** - Frequently asked questions

### User Documentation
- **[User Guide](User-Guide.md)** - Complete guide for using SideQuest
  - Authentication
  - Exploring tasks on the map
  - Posting and claiming tasks
  - Managing your profile and wallet

### Developer Documentation
- **[Technical Architecture](Technical-Architecture.md)** - System design and components
- **[Database Schema](Database-Schema.md)** - Firestore data structure and queries
- **[Development Guide](Development-Guide.md)** - Contributing to SideQuest
  - Code structure
  - Adding new features
  - Testing guidelines
  - Code style guide

### Operations & Deployment
- **[Security Guide](Security-Guide.md)** - Security best practices
  - Firestore security rules
  - Authentication security
  - Input validation
  - Wallet security
- **[Deployment Guide](Deployment-Guide.md)** - Deploy to production
  - Firebase Hosting
  - Netlify
  - Vercel
  - GitHub Pages

## 🎯 Quick Links

### For Users
1. New to SideQuest? Start with the [Home](Home.md) page
2. Want to use the app? Read the [User Guide](User-Guide.md)
3. Have questions? Check the [FAQ](FAQ.md)

### For Developers
1. Want to contribute? Read the [Development Guide](Development-Guide.md)
2. Need to understand the code? See [Technical Architecture](Technical-Architecture.md)
3. Working with the database? See [Database Schema](Database-Schema.md)

### For Deployers
1. Ready to deploy? Follow the [Deployment Guide](Deployment-Guide.md)
2. Concerned about security? Read the [Security Guide](Security-Guide.md)
3. Need to set up? Start with [Installation Guide](Installation-Guide.md)

## 🔍 What is SideQuest?

SideQuest is a hyperlocal, real-time marketplace that connects neighbors who need help with tasks to neighbors who have time to help. Think of it as IRL side-quests for your neighborhood! 🎮

**Key Features:**
- 🗺️ Interactive real-time map
- 💰 Secure escrow payment system
- 👥 User profiles & ratings
- 📱 Mobile-first responsive design
- 🏷️ Task categories (Help, Delivery, Social, Other)

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML, CSS
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS
- **Backend**: Firebase (Firestore + Authentication)
- **Real-time**: Firestore real-time listeners

## 📖 Documentation Structure

The wiki is organized into clear sections:

```
wiki/
├── README.md                    # This file
├── Home.md                      # Wiki home page
│
├── Getting Started/
│   ├── Installation-Guide.md   # Local setup
│   └── FAQ.md                   # Common questions
│
├── User Documentation/
│   └── User-Guide.md           # How to use the app
│
├── Developer Documentation/
│   ├── Technical-Architecture.md   # System design
│   ├── Database-Schema.md          # Data structure
│   └── Development-Guide.md        # Contributing guide
│
└── Operations/
    ├── Security-Guide.md        # Security best practices
    └── Deployment-Guide.md      # Deployment instructions
```

## 🤝 Contributing to the Wiki

Found an error or want to improve the documentation?

1. **For simple fixes**: Open an issue on GitHub
2. **For larger changes**: Submit a pull request
3. **Keep it clear**: Use simple language and examples
4. **Stay organized**: Follow the existing structure

### Writing Guidelines

- Use clear, concise language
- Include code examples where relevant
- Add links to related pages
- Use emojis sparingly for visual organization
- Keep formatting consistent

## 📝 Documentation Standards

### Markdown Format

- Use ATX-style headers (`#`, `##`, `###`)
- Use fenced code blocks with language tags
- Use tables for structured data
- Include navigation links at page bottom

### Code Examples

```javascript
// ✅ Good: Clear, commented example
async function createTask(data) {
    try {
        const docRef = await addDoc(collection(db, 'tasks'), data);
        return docRef.id;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

// ❌ Bad: Uncommented, unclear
function ct(d) { return addDoc(c(db,'t'),d).then(r=>r.id); }
```

### Screenshots & Diagrams

- Use ASCII diagrams for architecture
- Include screenshots for UI features
- Keep images in a separate `images/` folder (when needed)
- Optimize images for web (compress, resize)

## 🔄 Keeping Documentation Updated

The wiki should be updated when:
- New features are added
- APIs change
- Security practices evolve
- Common issues are discovered
- User feedback suggests improvements

## 📞 Getting Help

Can't find what you're looking for?

1. **Search the wiki**: Use Ctrl+F or GitHub's search
2. **Check the FAQ**: Most common questions are answered there
3. **Open an issue**: Ask on [GitHub Issues](https://github.com/Kaelith69/SideQuest/issues)
4. **Read the code**: Sometimes the code is the best documentation!

## 🌟 Wiki TODO

Future documentation improvements:

- [ ] Add troubleshooting guide with common errors
- [ ] Create API reference for all functions
- [ ] Add video tutorials
- [ ] Create deployment checklist
- [ ] Add performance optimization guide
- [ ] Create contributor onboarding guide
- [ ] Add examples repository

## 📄 License

The SideQuest documentation is part of the SideQuest project and is licensed under the MIT License.

---

**Start exploring**: [Go to Wiki Home](Home.md) →
