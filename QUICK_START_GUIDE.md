# Employee Section - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js installed
- npm or yarn package manager
- React Router DOM v6+
- Tailwind CSS configured
- react-icons library

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will start on `http://localhost:5173` (or your configured port)

---

## 🔐 Login as Employee

To test the employee section:

1. Go to login page
2. Use credentials with role: **"employee"**
3. The app will navigate based on your role
4. Click "Dashboard" in sidebar to see employee dashboard

### Sample Employee Data
```javascript
// In localStorage after login
{
  id: "EMP001",
  name: "Arjun Sharma",
  email: "arjun.sharma@company.com",
  role: "employee"
}
```

---

## 🗺️ Navigation Guide

### Sidebar Menu Items
| Icon | Label | Route | Purpose |
|------|-------|-------|---------|
| 🏠 | Dashboard | `/employee/dashboard` | Overview of all metrics |
| 📅 | Attendance | `/employee/attendance` | Attendance tracking |
| ⏱️ | Time Off | `/employee/leave` | Leave management |
| 👤 | Profile | `/employee/profile` | Personal information |

### How to Navigate
1. Click menu item in sidebar
2. Page loads with smooth transition
3. Active item highlighted in blue
4. Data updates automatically

---

## 📊 Pages Overview

### 1. Employee Dashboard (`/employee/dashboard`)
**What you see:**
- Today's attendance status
- Check-in/Check-out times
- Monthly attendance percentage
- Leave balance with progress
- Quick action buttons

**Key Features:**
- Color-coded status (Green/Red/Orange/Yellow)
- Leave types breakdown
- All metrics at a glance

**Time to view:** 10 seconds

---

### 2. Attendance Page (`/employee/attendance`)
**What you see:**
- Today's attendance section
- Calendar view of entire month
- Day-by-day breakdown option
- Monthly statistics
- Status legend

**Key Features:**
- Toggle between Calendar and List view
- Click calendar days for details
- Color-coded status
- Working hours display

**Time to view:** 15 seconds

---

### 3. Time Off Page (`/employee/leave`)
**What you see:**
- Leave balance cards (3 total/used/remaining)
- Leave types breakdown
- Leave request history
- "Apply Leave" button

**Key Features:**
- Expandable request details
- Status indicators
- Apply Leave modal form
- Request actions (Cancel/Edit for pending)

**Time to view:** 20 seconds

**To Apply Leave:**
1. Click "Apply Leave" button (top right)
2. Select leave type
3. Choose from/to dates
4. Add reason
5. Click "Submit"

---

### 4. Profile Page (`/employee/profile`)
**What you see:**
- Employee avatar and basic info
- Personal information section
- Professional information section
- Additional metrics
- Security settings

**Key Features:**
- Two-column layout
- Edit mode for personal details
- Read-only professional info
- Security settings section

**Time to view:** 15 seconds

**To Edit Profile:**
1. Click "Edit" button (top right)
2. Modify your information
3. Click "Save Changes" or "Cancel"

---

## 🎨 Understanding the Design

### Color Coding

**Attendance Status:**
- 🟢 **Green** = Present - You were present at work
- 🔴 **Red** = Absent - You were not present
- 🟠 **Orange** = Late - You arrived late
- 🟡 **Yellow** = Half Day - You worked half day

**Leave Status:**
- 🟢 **Green** = Approved - Leave request approved
- 🟡 **Yellow** = Pending - Waiting for approval
- 🔴 **Red** = Rejected - Leave request rejected

**UI Elements:**
- 🔵 **Blue** = Active/Selected, clickable buttons
- ⚪ **White** = Card backgrounds
- ⚫ **Gray** = Page background, secondary text

### Card Layouts
Each card has:
- Icon on the right
- Title/label at top
- Main data in large text
- Supporting info at bottom
- Hover effect for interactivity

---

## 🔄 Data Consistency

### What You Should Notice

**Dashboard ↔ Attendance:**
- Same attendance status
- Same check-in/out times
- Same monthly statistics

**Dashboard ↔ Leave:**
- Same leave balance
- Same remaining days
- Same leave types

**Dashboard ↔ Profile:**
- Same employee name
- Same department
- Same position

**Result:** All data stays consistent - no conflicts!

---

## 🎯 Quick Tips

### 1. Sidebar Toggle
Click the toggle button (◀ or ▶) at top right of sidebar to collapse/expand

### 2. View Modes
- Attendance has Calendar and List view toggle
- Switch views without reloading

### 3. Expandable Sections
- Click chevron (▼) to expand/collapse
- Smooth animation
- Details appear below

### 4. Modal Dialogs
- Click overlay to close
- Click Cancel button to close
- Click Submit to submit form

### 5. Active Route Highlighting
- Current page highlighted in blue
- Updates automatically as you navigate
- No manual refresh needed

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Sidebar collapses to icons only
- Touch-friendly sizes

### Tablet (768px - 1024px)
- Two column layout for some sections
- Sidebar visible with text
- Readable font sizes

### Desktop (> 1024px)
- Full multi-column layout
- Complete sidebar with text and icons
- All features accessible

**Try it:** Resize your browser to see responsive changes

---

## 🐛 Troubleshooting

### Page Not Loading
**Problem:** Employee pages show blank
**Solution:** 
1. Ensure you're logged in as an employee
2. Check console for errors (F12)
3. Refresh the page

### Sidebar Not Showing Menu
**Problem:** No menu items in sidebar
**Solution:**
1. Check user role in localStorage (F12 > Storage)
2. Role should be "employee"
3. If not, logout and login again

### Data Not Displaying
**Problem:** Cards show undefined or blank values
**Solution:**
1. This is using dummy data, should always have values
2. Clear localStorage and login again
3. Check browser console for JavaScript errors

### Navigation Not Working
**Problem:** Clicking sidebar items doesn't change page
**Solution:**
1. Check React Router setup in App.jsx
2. Ensure routes are wrapped with `<BrowserRouter>`
3. Try refreshing the page

---

## 💡 Testing Checklist

- [ ] Can navigate all 4 pages from sidebar
- [ ] Active route is highlighted in blue
- [ ] Data is same across all pages
- [ ] Calendar view shows colors correctly
- [ ] Can expand/collapse sections
- [ ] Can open Apply Leave modal
- [ ] Can toggle edit mode on profile
- [ ] Sidebar can collapse and expand
- [ ] Responsive on mobile/tablet/desktop
- [ ] All buttons are clickable

---

## 🔗 File Locations

| Feature | File | Type |
|---------|------|------|
| Dashboard | `src/pages/employee/Dashboard.jsx` | Page |
| Attendance | `src/pages/employee/Attendance.jsx` | Page |
| Leave | `src/pages/employee/Leave.jsx` | Page |
| Profile | `src/pages/employee/Profile.jsx` | Page |
| Dummy Data | `src/services/dummyData.js` | Service |
| Navigation | `src/components/Sidebar.jsx` | Component |
| Routing | `src/App.jsx` | Root |

---

## 📚 Further Reading

- **EMPLOYEE_SECTION_GUIDE.md** - Complete feature documentation
- **EMPLOYEE_SECTION_COMPLETE.md** - Summary of implementation
- **API_INTEGRATION_EXAMPLES.md** - How to connect to backend
- **VISUAL_OVERVIEW.md** - Visual layouts and diagrams
- **IMPLEMENTATION_CHECKLIST.md** - Detailed checklist

---

## 🚀 Next Steps

### Short Term (Days)
1. Test all pages thoroughly
2. Review design with team
3. Get feedback on UX

### Medium Term (Weeks)
1. Connect to backend APIs
2. Replace dummy data with real data
3. Add form validation
4. Add error handling

### Long Term (Months)
1. Add notifications
2. Add search/filter
3. Add export functionality
4. Performance optimization

---

## ❓ FAQ

**Q: Can I edit the dummy data?**
A: Yes! Edit `src/services/dummyData.js` - all pages will update automatically

**Q: Can I change colors?**
A: Yes! Edit the CSS classes in component files or tailwind.config.js

**Q: Can I add more leave types?**
A: Yes! Add to the `leaveTypes` array in `dummyData.js`

**Q: Will this work without a backend?**
A: Yes! It's fully frontend with dummy data. Backend ready when you are!

**Q: How long to integrate with backend?**
A: 1-2 days for a developer familiar with APIs and React

**Q: Is mobile optimization complete?**
A: Yes! Layout is responsive and mobile-friendly

---

## 📞 Support

If you encounter issues:
1. Check the browser console (F12)
2. Review the troubleshooting section above
3. Check the documentation files
4. Review the code comments

---

## ✅ You're All Set!

The Employee section is ready to use. Enjoy exploring the HRMS!

**Happy Testing! 🎉**
