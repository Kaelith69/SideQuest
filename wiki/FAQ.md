# FAQ - Frequently Asked Questions

Quick answers to common questions about SideQuest.

## General Questions

### What is SideQuest?

SideQuest is a hyperlocal marketplace app that connects neighbors who need help with tasks to neighbors who can help. Think of it as a real-world quest board for your neighborhood!

### Is SideQuest free to use?

Yes! SideQuest is free and open-source (MIT License). However, individual tasks may have rewards that cost money.

### What platforms does SideQuest support?

SideQuest is a web application that works on:
- Mobile browsers (iOS Safari, Android Chrome)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets

A native mobile app is planned for future development.

### Do I need to create an account?

Yes, you need an account to post or claim tasks. This helps build trust and track reputation in the community.

---

## Getting Started

### How do I sign up?

1. Open SideQuest in your browser
2. Click "New to SideQuest? Sign Up"
3. Enter your name, email, and password
4. Click "Create Account"

### I forgot my password. How do I reset it?

Password reset functionality is currently in development. For now, contact support or create a new account with a different email.

### Do I need to allow location access?

Location access is optional but highly recommended. It allows:
- The map to center on your location
- Display of your distance to tasks
- Better task discovery

You can still use SideQuest without location access, but you'll need to manually navigate the map.

### Why can't I just open index.html directly?

Modern browsers block certain features (like ES modules) when files are opened directly due to CORS security policies. You must run a local web server. See the [Installation Guide](Installation) for details.

---

## Using SideQuest

### How do I post a task?

1. Click the blue + button in the bottom-right corner
2. Fill in the task title, description, category
3. Optionally add a reward amount
4. Click "Post Task"

Your task will appear on the map immediately.

### How do I claim a task?

1. Browse the map and tap any task marker
2. Read the task details
3. Click "I'll do it!" if you want to help
4. Complete the task in real life
5. Mark it as complete in the app

### Can I claim my own tasks?

No, you cannot claim tasks you posted yourself. That would be cheating! 😄

### What happens to the reward money?

When you post a task with a reward:
1. The amount is deducted from your wallet immediately
2. It's held in escrow (safe and locked)
3. When the task is completed and rated, it's released to the person who helped you
4. If you delete the task, the money is refunded to your wallet

### How do I add money to my wallet?

Currently, there's no built-in payment system. Money can be added:
- By completing tasks for others
- Manually by a Firebase admin (for testing)

Integration with payment gateways (Stripe, Razorpay) is planned for future updates.

### How long do tasks stay on the map?

Tasks older than 24 hours are automatically deleted to keep the map fresh and relevant. Make sure to check the app regularly!

### Can I edit a task after posting it?

Not currently. If you need to change something, you'll need to delete the task and create a new one. Task editing is planned for a future update.

### Can I delete a task?

Yes, you can delete tasks you posted, but only if they haven't been claimed yet. Once claimed, the task is in progress and cannot be deleted.

### What if someone claims my task but doesn't do it?

This is a known limitation. Future updates will include:
- Time limits for task completion
- Ability to cancel/reassign tasks
- Reporting system for unreliable users

For now, try to communicate outside the app if issues arise.

### How do ratings work?

After a task is completed:
1. The task poster rates the task completer (1-5 stars)
2. The rating is added to the completer's profile
3. Average rating is calculated and displayed

Ratings help build trust in the community.

### Can I rate someone negatively?

Yes, ratings from 1-5 stars are all valid. Be honest but fair:
- 5★ = Excellent
- 4★ = Good
- 3★ = Acceptable
- 2★ = Poor
- 1★ = Very poor or task not completed

### Can I message other users?

Not yet. Direct messaging is planned for a future update. For now, include contact info in your task description if needed (though be cautious about privacy).

---

## Technical Questions

### What technology is SideQuest built with?

- **Frontend**: Vanilla JavaScript (ES6+), HTML, CSS
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS
- **Backend**: Firebase (Firestore + Auth)

### Is my data secure?

In the current development version, security is minimal. For production use:
- Update Firestore security rules (see [Privacy & Security](Privacy))
- Enable email verification
- Set up proper authentication
- Use HTTPS

Never deploy with default settings to production!

### Can I self-host SideQuest?

Yes! SideQuest is open-source. You can:
- Host the frontend on any static hosting (Firebase Hosting, Netlify, Vercel)
- Use your own Firebase project
- Modify the code as needed (MIT License)

See [Installation Guide](Installation) for details.

### Does SideQuest work offline?

Not currently. SideQuest requires an internet connection for:
- Real-time updates
- Map tiles
- Firebase communication

Offline support (PWA) is planned for future development.

### Why is the map not loading?

Common causes:
1. No internet connection
2. Location permissions denied (map needs to load tiles)
3. Browser blocking third-party cookies
4. Ad blocker interfering with MapLibre CDN

Try disabling ad blockers or using a different browser.

### How do I report a bug?

1. Go to [GitHub Issues](https://github.com/Kaelith69/SideQuest/issues)
2. Click "New Issue"
3. Describe the bug:
   - What you expected
   - What actually happened
   - Steps to reproduce
   - Browser and device info
4. Submit the issue

---

## Troubleshooting

### The app won't load

**Try these steps:**
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check browser console for errors (F12)
4. Verify you're using a modern browser
5. Try incognito/private mode

### I can't sign in

**Possible causes:**
1. Wrong email or password (try again carefully)
2. Account doesn't exist (sign up instead)
3. Firebase Auth is down (check [Firebase Status](https://status.firebase.google.com/))
4. Network issues

### Tasks aren't showing on the map

**Check:**
1. Are you signed in?
2. Is the map fully loaded?
3. Try zooming out (tasks might be outside view)
4. Check browser console for errors
5. Try refreshing the page

### "Permission denied" errors

This usually means:
1. Firestore security rules are blocking access
2. You're not signed in
3. Your session expired (sign out and sign back in)

### The map is stuck/frozen

1. Refresh the page
2. Clear browser cache
3. Try a different browser
4. Check if your device is low on memory

---

## Privacy & Safety

### What information does SideQuest collect?

SideQuest collects:
- Email and name (for account)
- Location (if you grant permission)
- Task data you post
- Wallet balance and transaction history

Your data is stored in Firebase and not shared with third parties.

### Is my location shared with others?

Your exact location is **not** shared. Task locations use the map center when you create a task, which is approximate. Other users see:
- Task location on map (not your home address)
- Distance from their location to the task

### How do I delete my account?

Account deletion is not currently implemented in the UI. To delete your account:
1. Contact the administrator
2. Or use Firebase Console to manually delete your user data

This will be added to the app in a future update.

### How do I report inappropriate tasks or users?

Currently, there's no built-in reporting system. For now:
1. Open a GitHub issue
2. Email the maintainer
3. Avoid claiming suspicious tasks

A proper reporting system is planned for future updates.

---

## Contributing

### Can I contribute to SideQuest?

Absolutely! SideQuest is open-source and welcomes contributions:
- Code improvements
- Bug fixes
- Documentation updates
- Feature suggestions

See [Contributing Guide](Contributing) for details.

### I have a feature idea. Where do I share it?

1. Check existing [GitHub Issues](https://github.com/Kaelith69/SideQuest/issues) first
2. If it's not already suggested, open a new issue
3. Use the "Feature Request" template
4. Describe your idea clearly

### How do I submit a pull request?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [Contributing Guide](Contributing) for detailed instructions.

---

## Future Plans

### What features are coming next?

Check the [Roadmap](Roadmap) for planned features, including:
- Direct messaging between users
- Task editing
- Payment gateway integration
- Push notifications
- Native mobile apps
- In-app reporting system
- Task categories expansion
- Photo uploads for tasks

### When will [feature] be available?

SideQuest is a community project developed in spare time. There are no guaranteed timelines. Want a feature faster? Consider contributing! 🚀

### Will SideQuest always be free?

The core app will always be free and open-source. Future possibilities:
- Premium features (e.g., priority listings)
- Small transaction fees for monetization
- Optional donations

No decisions have been made yet. Community input is welcome!

---

## Still Have Questions?

- Check the [Usage Guide](Usage) for detailed instructions
- Read the [Troubleshooting Guide](Troubleshooting) for common issues
- Search [existing issues](https://github.com/Kaelith69/SideQuest/issues) on GitHub
- Open a new issue if your question isn't answered

---

[← Back to Home](Home)
