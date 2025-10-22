## 🧠 **Image Library Manager – Functional Summary**

### 🎯 **Purpose**

The **Image Library Manager** is a complete React-based web application designed to **manage, categorize, edit, and synchronize image assets** across local and cloud storage.
 It supports **Global ID tracking**, **metadata management**, and **synchronization** with a backend Azure Function API — ensuring that every image is properly organized, versioned, and consistent between local and remote environments.

------

### 🖼️ **Core Features & Actions**

#### 1. **Image Display & Filtering**

- Displays all images from the connected database or API in **three view modes**:
  - **Grid View:** Compact visual thumbnails with quick actions.
  - **List View:** Detailed rows with metadata and sync status.
  - **Table View:** Spreadsheet-style data display for technical review.
  
- Includes a **search bar** and multiple filters:
  - **Category filter**
  
  - **Sync status filter (Up-to-date / Pending / Conflict)**
  
  - **Deleted images toggle**
  
  - **search images by free text** *(filter as name or tags)*
  
    

#### 2. **Upload System**

- Users can upload new images through the **UploadArea** component:
  - Supports drag-and-drop or file browser selection.
  - Automatically extracts **EXIF metadata** (width, height, format).
  - Assigns a **temporary Global ID** and marks as **pending** for sync.
  - Previews thumbnails locally using `URL.createObjectURL`.
  - Shows a success toast after upload.

#### 3. **Edit & Tagging**

- Each image can be **edited inline** using the **EditImageModal**, which allows:
  - Updating **description**, **category**, and **tags**.
  - Creating new tags or selecting existing ones dynamically.
  - Tags are stored and fetched from the backend (`tblTags` table).
  - Changes are persisted via the `updateImage()` API call.

#### 4. **Application Metadata Management**

- The **AppSettingsModal** enables defining contextual metadata that applies to the whole library:
  - **Applications:** (Cosmetician, E-commerce, B2B, B2C)
  - **Languages:** (EN, HE, AR, etc.)
  - **Target Platforms:** (web, mobile, desktop, linux, etc.)
  - **Custom Tags**: added manually or selected from predefined sets.
- Metadata is stored in a structured `AppMetadata` object and used when uploading or syncing images.
- Live JSON preview helps visualize the full metadata configuration before saving.

#### 5. **Sync Functionality**

- **SyncButton** initiates synchronization with the Azure backend.
- Sync includes:
  - Uploading **new or modified images** (`syncImages()`).
  - Syncing **deleted or restored images** (`syncDeletedImages()`).
  - Updating local image states (`up-to-date`, `pending`, `conflict`).
- Progress is shown in real-time with a spinning icon and confirmation toast messages.

#### 6. **Delete and Restore**

- Images can be **soft deleted** (moved to trash) or **restored** without permanent loss.
- Deleted images are visually dimmed and labeled.
- A **Deleted** filter allows quick access to removed items.

#### 7. **Preview & Metadata Viewer**

- Clicking the **preview icon** opens a standalone image viewer in a new tab.
- Users can also view the raw **AppMetadata** JSON for each image in a modal alert.

#### 8. **Statistics & Dashboard**

- Displays key statistics at the top of the page:
  - Total images
  - Pending uploads
  - Conflict items
  - Deleted items
- Auto-updates dynamically as images are uploaded, deleted, or synced.

#### 9. **Dynamic Display Control**

- The **DisplayModeToggle** component provides easy switching between grid, list, and table layouts — maintaining consistent actions and style.

#### 10. **User Experience Enhancements**

- Integrated **toast notifications** for all critical actions.
- Optimized **async loading** of categories, tags, and images.
- Responsive UI with Tailwind-based design and Shadcn components.
- Intuitive buttons and icons using **Lucide-react**.

#### 11. **Local Storage Directory (W:/SYNOIA/Library Images/)**

- All images are stored in the shared network directory **`W:/SYNOIA/Library Images/`**, which serves as the **staging area** for local image management.
- Uploaded files are temporarily saved here before synchronization with the cloud (Azure Blob Storage).
- This directory acts as the **bridge between local editing and backend synchronization**, ensuring that each image has a traceable local copy.

#### 12. **Per-Image App Metadata**

- Each image can now carry its own metadata, reflecting unique contexts such as different apps, languages, or platforms..
- Sync always respects individual settings.
- Maintains backward compatibility with existing global metadata behavior.

------

### 🧩 **Technical Overview**

- **Frontend Stack:** React + TypeScript + Vite + TailwindCSS + Shadcn UI
- **Backend Integration:** SyncFunctionsApp - Azure Function APIs (`fetchImages`, `syncImages`, `fetchCategories`, `updateImage`, etc.)
- **Data Model:**
  - `ImageItem`: Represents each image with metadata, sync state, and display data.
  - `AppMetadata`: Holds app-wide context (apps, langs, platforms, version).
- **Cloud Interaction:** Uses **Azure Blob Storage** for cloud storage and **SQL-based APIs** for metadata management.

------

### ✅ **Overall Workflow**

1. **Load:** Fetch images and categories from the API.
2. **Filter or Search:** User refines visible results.
3. **Upload:** Add new local images (pending sync).
4. **Edit:** Modify descriptions, categories, or tags.
5. **Sync:** Upload all pending or deleted images to the cloud.
6. **Review:** Monitor synchronization status and metadata in multiple layouts.