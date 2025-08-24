# Course Builder

A React app I built for creating and organizing online courses. It lets you build course structures with modules, add resources like links and files, and organize everything with drag & drop.

## 🚀 Live Demo

**Try it out:** [https://toddle-test-s6qzby6m0-ashirvaddubeys-projects.vercel.app](https://toddle-test-s6qzby6m0-ashirvaddubeys-projects.vercel.app)

---

## What it does

### Modules

- Create new modules with custom names
- Edit existing modules (rename them)
- Delete modules when you don't need them
- Drag and drop to reorder modules

### Resources

- Add links to external content
- Upload files (PDFs, images, etc.)
- Edit resource titles and details
- Delete resources you don't want
- Resources can live inside modules or stand alone
- Drag resources around to reorder them or move them between modules

### Outline View

- See an overview of your entire course
- Click on any module to jump to it
- Automatically highlights the module you're currently viewing
- Toggle it on/off with the 📋 button

### Search

- Find modules and resources quickly
- Search updates as you type
- Shows context - if you search for a resource, you'll see its parent module too

### Drag & Drop

- Reorder modules by dragging them around
- Reorder resources within modules
- Move resources between different modules
- Visual feedback while dragging

## How the data is organized

I structured the data to be flexible and scalable:

```javascript
{
  modules: [
    {
      id: "unique_id",
      name: "Module Name",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  resources: [
    {
      id: "unique_id",
      moduleId: "module_id", // null if it's not in a module
      type: "link" | "file",
      title: "Resource Title",
      url: "https://example.com", // for links
      fileName: "file.pdf", // for files
      fileSize: 1024, // for files
      fileType: "application/pdf", // for files
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  moduleOrder: ["module_id_1", "module_id_2"], // keeps track of module order
  resourceOrder: {
    "module_id": ["resource_id_1", "resource_id_2"] // keeps track of resource order per module
  }
}
```

This structure makes it easy to:

- Add new types of resources later
- Search across all content efficiently
- Handle drag & drop operations smoothly
- Keep everything organized

## How the components are organized

```
src/
├── components/
│   ├── modules/
│   │   ├── CourseBuilder.jsx      # Main app component
│   │   ├── ModuleCard.jsx         # Shows individual modules
│   │   ├── ModuleItem.jsx         # Shows individual resources
│   │   ├── ModuleModal.jsx        # Create/edit module popup
│   │   ├── LinkModal.jsx          # Add/edit link popup
│   │   ├── UploadModal.jsx        # Add/edit file popup
│   │   └── OutlineView.jsx        # Course outline sidebar
│   └── ui/
│       ├── Header.jsx             # Top bar with search and buttons
│       └── EmptyState.jsx         # Shows when there's no content
```

## Tech stack

- **React 19** - Using modern hooks and patterns
- **react-dnd** - For the drag & drop functionality
- **react-dnd-html5-backend** - HTML5 drag & drop support
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with animations
- **localStorage** - Saves your data automatically

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

1. Clone the repo
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app will be at `http://localhost:5173`

4. Build for production:
   ```bash
   npm run build
   ```

## How to use it

### Building your first course

1. **Start with a module**

   - Click the "Add" button in the header
   - Choose "Create module"
   - Give it a name like "Introduction to React"

2. **Add some resources**

   - Click on a module to expand it
   - Click "Add item" inside the module
   - Pick either:
     - **Link**: Add external resources with titles and URLs
     - **File**: Upload files with custom titles

3. **Organize with drag & drop**

   - **Reorder modules**: Drag module cards around
   - **Reorder resources**: Drag resources within modules
   - **Move resources**: Drag resources between modules

4. **Use the outline**

   - Toggle the outline panel with the 📋 button
   - Click on any module in the outline to jump to it
   - See how many resources each module has

5. **Search for stuff**
   - Use the search bar to find specific content
   - Search works across module names and resource titles
   - Results update as you type

### Cool features

- **Standalone resources**: Add resources without putting them in modules
- **Edit everything**: Click edit buttons to modify existing content
- **Responsive**: Works on desktop, tablet, and mobile
- **Auto-save**: Everything saves automatically to your browser

## Design stuff

### UI/UX

- Clean, modern look following current design trends
- Smooth animations and transitions
- Responsive grid layout that adapts to screen size
- Consistent colors and typography

### Visual feedback

- Hover effects on interactive elements
- Visual indicators during drag operations
- Smooth transitions between states
- Highlighted active elements

### Accessibility

- Keyboard navigation works
- Screen reader friendly
- High contrast elements
- Clear visual hierarchy

## Customizing

### Styling

The app uses modern CSS features. You can customize:

- Colors in `src/App.css`
- Layout dimensions and spacing
- Typography and font sizes
- Animation timing

### Adding new resource types

Want to add videos or quizzes? Here's how:

1. Update the data structure in `CourseBuilder.jsx`
2. Create new modal components for the resource type
3. Update `ModuleItem.jsx` to render the new type
4. Add the CSS styles

## Deploying

### Vercel (easiest)

1. Connect your GitHub repo to Vercel
2. Vercel will automatically detect it's a React app
3. Deploy with zero config

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. You're done!

### Other platforms

The built app is just a static site, so it'll work on any hosting platform.

## Troubleshooting

### Common issues

1. **Drag & drop not working**

   - Make sure you're using a modern browser
   - Check that react-dnd is installed properly
   - Verify the DndProvider is wrapping your app

2. **Data not saving**

   - Check the browser console for errors
   - Make sure localStorage is enabled
   - Check if the data structure changed

3. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Look for syntax errors in your JSX files
   - Check that all imports are correct

## What I learned building this

This project taught me a lot about:

- Building scalable React architectures
- Implementing smooth drag & drop experiences
- Managing complex state with hooks
- Creating responsive, accessible UIs
- Structuring data for performance

## Future ideas

Some things I'd like to add later:

- Video and quiz resource types
- User accounts and permissions
- Advanced search with filters and tags
- Export/import course data
- Real-time collaboration
- Mobile app version

## Contributing

Found a bug? Want to add a feature?

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test everything works
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects.

---

**Happy course building! 🎓**

If you have questions or run into issues, feel free to open an issue on GitHub.
