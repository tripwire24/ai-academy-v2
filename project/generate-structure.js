const fs = require('fs');
const path = require('path');

const files = {
  'src/app/page.tsx': `// TODO: Implement Landing / marketing page
export default function Page() {
  return <div>Landing Page</div>;
}`,
  'src/app/(auth)/login/page.tsx': `// TODO: Implement Login page
export default function LoginPage() {
  return <div>Login</div>;
}`,
  'src/app/(auth)/register/page.tsx': `// TODO: Implement Register page
export default function RegisterPage() {
  return <div>Register</div>;
}`,
  'src/app/(auth)/forgot-password/page.tsx': `// TODO: Implement Forgot Password page
export default function ForgotPasswordPage() {
  return <div>Forgot Password</div>;
}`,
  'src/app/(dashboard)/layout.tsx': `// TODO: Implement Authenticated layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}`,
  'src/app/(dashboard)/page.tsx': `// TODO: Implement Dashboard home
export default function DashboardPage() {
  return <div>Dashboard</div>;
}`,
  'src/app/(dashboard)/courses/page.tsx': `// TODO: Implement Course catalogue
export default function CoursesPage() {
  return <div>Courses</div>;
}`,
  'src/app/(dashboard)/courses/[courseSlug]/page.tsx': `// TODO: Implement Course overview
export default function CourseOverviewPage() {
  return <div>Course Overview</div>;
}`,
  'src/app/(dashboard)/courses/[courseSlug]/[moduleSlug]/page.tsx': `// TODO: Implement Module overview
export default function ModuleOverviewPage() {
  return <div>Module Overview</div>;
}`,
  'src/app/(dashboard)/courses/[courseSlug]/[moduleSlug]/[lessonSlug]/page.tsx': `// TODO: Implement Lesson viewer
export default function LessonViewerPage() {
  return <div>Lesson Viewer</div>;
}`,
  'src/app/(dashboard)/notes/page.tsx': `// TODO: Implement User notes dashboard
export default function NotesPage() {
  return <div>Notes</div>;
}`,
  'src/app/(dashboard)/profile/page.tsx': `// TODO: Implement User profile & settings
export default function ProfilePage() {
  return <div>Profile</div>;
}`,
  'src/app/(dashboard)/certificates/page.tsx': `// TODO: Implement Earned certificates
export default function CertificatesPage() {
  return <div>Certificates</div>;
}`,
  'src/app/(admin)/layout.tsx': `// TODO: Implement Admin layout
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}`,
  'src/app/(admin)/page.tsx': `// TODO: Implement Admin dashboard
export default function AdminDashboardPage() {
  return <div>Admin Dashboard</div>;
}`,
  'src/app/(admin)/courses/page.tsx': `// TODO: Implement Manage courses
export default function AdminCoursesPage() {
  return <div>Manage Courses</div>;
}`,
  'src/app/(admin)/courses/new/page.tsx': `// TODO: Implement Create course
export default function AdminNewCoursePage() {
  return <div>Create Course</div>;
}`,
  'src/app/(admin)/courses/[courseId]/page.tsx': `// TODO: Implement Edit course
export default function AdminEditCoursePage() {
  return <div>Edit Course</div>;
}`,
  'src/app/(admin)/courses/[courseId]/modules/page.tsx': `// TODO: Implement Manage modules
export default function AdminModulesPage() {
  return <div>Manage Modules</div>;
}`,
  'src/app/(admin)/courses/[courseId]/modules/[moduleId]/page.tsx': `// TODO: Implement Edit module + lessons
export default function AdminEditModulePage() {
  return <div>Edit Module</div>;
}`,
  'src/app/(admin)/users/page.tsx': `// TODO: Implement User management
export default function AdminUsersPage() {
  return <div>User Management</div>;
}`,
  'src/app/(admin)/content/page.tsx': `// TODO: Implement MD file upload & management
export default function AdminContentPage() {
  return <div>Content Management</div>;
}`,
  'src/app/(admin)/analytics/page.tsx': `// TODO: Implement Platform analytics
export default function AdminAnalyticsPage() {
  return <div>Analytics</div>;
}`,
  'src/app/api/auth/route.ts': `// TODO: Implement Auth webhooks
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({}); }`,
  'src/app/api/courses/route.ts': `// TODO: Implement Course CRUD
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({}); }`,
  'src/app/api/progress/route.ts': `// TODO: Implement Progress tracking
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({}); }`,
  'src/app/api/notes/route.ts': `// TODO: Implement User notes
import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({}); }`,
  'src/app/api/ai/route.ts': `// TODO: Implement AI assistant endpoint
import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({}); }`,
  'src/app/api/upload/route.ts': `// TODO: Implement File upload handler
import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({}); }`,
  'src/app/api/webhooks/route.ts': `// TODO: Implement External integrations
import { NextResponse } from 'next/server';
export async function POST() { return NextResponse.json({}); }`,
  'src/components/ui/index.ts': `// TODO: Export UI components
export {};`,
  'src/components/course/CourseCard.tsx': `// TODO: Implement CourseCard
export function CourseCard() { return <div>CourseCard</div>; }`,
  'src/components/course/ModuleList.tsx': `// TODO: Implement ModuleList
export function ModuleList() { return <div>ModuleList</div>; }`,
  'src/components/course/LessonViewer.tsx': `// TODO: Implement LessonViewer
export function LessonViewer() { return <div>LessonViewer</div>; }`,
  'src/components/progress/ProgressBar.tsx': `// TODO: Implement ProgressBar
export function ProgressBar() { return <div>ProgressBar</div>; }`,
  'src/components/progress/ProgressRing.tsx': `// TODO: Implement ProgressRing
export function ProgressRing() { return <div>ProgressRing</div>; }`,
  'src/components/progress/ModuleGate.tsx': `// TODO: Implement ModuleGate
export function ModuleGate() { return <div>ModuleGate</div>; }`,
  'src/components/content/MDXRenderer.tsx': `// TODO: Implement MDXRenderer
export function MDXRenderer() { return <div>MDXRenderer</div>; }`,
  'src/components/content/VideoEmbed.tsx': `// TODO: Implement VideoEmbed
export function VideoEmbed() { return <div>VideoEmbed</div>; }`,
  'src/components/content/HandoutCard.tsx': `// TODO: Implement HandoutCard
export function HandoutCard() { return <div>HandoutCard</div>; }`,
  'src/components/notes/NoteEditor.tsx': `// TODO: Implement NoteEditor
export function NoteEditor() { return <div>NoteEditor</div>; }`,
  'src/components/notes/NotesList.tsx': `// TODO: Implement NotesList
export function NotesList() { return <div>NotesList</div>; }`,
  'src/components/ai/AIChatWidget.tsx': `// TODO: Implement AIChatWidget
export function AIChatWidget() { return <div>AIChatWidget</div>; }`,
  'src/components/ai/AIChatPanel.tsx': `// TODO: Implement AIChatPanel
export function AIChatPanel() { return <div>AIChatPanel</div>; }`,
  'src/components/admin/AdminTable.tsx': `// TODO: Implement AdminTable
export function AdminTable() { return <div>AdminTable</div>; }`,
  'src/components/admin/FileUploader.tsx': `// TODO: Implement FileUploader
export function FileUploader() { return <div>FileUploader</div>; }`,
  'src/components/admin/CourseEditor.tsx': `// TODO: Implement CourseEditor
export function CourseEditor() { return <div>CourseEditor</div>; }`,
  'src/components/shared/LoadingSpinner.tsx': `// TODO: Implement LoadingSpinner
export function LoadingSpinner() { return <div>LoadingSpinner</div>; }`,
  'src/components/shared/ErrorBoundary.tsx': `// TODO: Implement ErrorBoundary
export function ErrorBoundary({ children }: { children: React.ReactNode }) { return <>{children}</>; }`,
  'src/components/shared/Toast.tsx': `// TODO: Implement Toast
export function Toast() { return <div>Toast</div>; }`,
  'src/lib/supabase/client.ts': `// TODO: Implement Browser Supabase client
export const supabaseClient = {};`,
  'src/lib/supabase/server.ts': `// TODO: Implement Server Supabase client
export const createServerClient = () => ({});`,
  'src/lib/supabase/middleware.ts': `// TODO: Implement Auth middleware
export const updateSession = async () => {};`,
  'src/lib/supabase/types.ts': `// TODO: Implement Generated DB types
export type Database = {};`,
  'src/lib/mdx/parse.ts': `// TODO: Implement MD -> MDX processing pipeline
export const parseMDX = async () => {};`,
  'src/lib/mdx/components.ts': `// TODO: Implement Custom MDX components map
export const components = {};`,
  'src/lib/mdx/frontmatter.ts': `// TODO: Implement Frontmatter schema + validation
export const validateFrontmatter = () => {};`,
  'src/lib/ai/client.ts': `// TODO: Implement AI API client
export const aiClient = {};`,
  'src/lib/ai/prompts.ts': `// TODO: Implement System prompts per context
export const prompts = {};`,
  'src/lib/ai/rag.ts': `// TODO: Implement RAG
export const retrieveContext = async () => {};`,
  'src/lib/auth/guards.ts': `// TODO: Implement Role checks, route protection
export const checkRole = () => {};`,
  'src/lib/utils/cn.ts': `// TODO: Implement Tailwind class merger
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
  'src/lib/utils/dates.ts': `// TODO: Implement Date formatting
export const formatDate = () => {};`,
  'src/lib/utils/validators.ts': `// TODO: Implement Zod schemas
export const schemas = {};`,
  'src/lib/constants.ts': `// TODO: Implement App-wide constants
export const CONSTANTS = {};`,
  'src/hooks/useProgress.ts': `// TODO: Implement Progress tracking hook
export const useProgress = () => {};`,
  'src/hooks/useNotes.ts': `// TODO: Implement Notes CRUD hook
export const useNotes = () => {};`,
  'src/hooks/useCourse.ts': `// TODO: Implement Course data hook
export const useCourse = () => {};`,
  'src/hooks/useAI.ts': `// TODO: Implement AI chat hook
export const useAI = () => {};`,
  'src/hooks/stores/progressStore.ts': `// TODO: Implement Zustand progress state
export const useProgressStore = () => {};`,
  'src/hooks/stores/uiStore.ts': `// TODO: Implement Zustand UI state
export const useUIStore = () => {};`,
  'src/types/database.ts': `// TODO: Implement Supabase generated types
export type DB = {};`,
  'src/types/course.ts': `// TODO: Implement Course/Module/Lesson types
export type Course = {};`,
  'src/types/user.ts': `// TODO: Implement User/Profile types
export type User = {};`,
  'src/types/api.ts': `// TODO: Implement API request/response types
export type APIResponse = {};`,
  'supabase/config.toml': `# TODO: Implement Supabase project config`,
  'content/courses/executive-ai-training/course.json': `{ "title": "Executive AI Training" }`,
  'content/courses/executive-ai-training/tier-1-foundational/module.json': `{ "title": "F1: AI Demystified" }`,
  'content/courses/executive-ai-training/tier-1-foundational/F1_AI_Demystified.md': `# F1 AI Demystified`,
  'content/courses/executive-ai-training/tier-1-foundational/F2_AI_Risk_Governance.md': `# F2 AI Risk Governance`,
  'content/courses/executive-ai-training/tier-1-foundational/F3_AI_Ready_Organization.md': `# F3 AI Ready Organization`,
  'content/courses/executive-ai-training/tier-2-implementation/module.json': `{ "title": "I1: Prompt Engineering" }`,
  'content/courses/executive-ai-training/tier-2-implementation/I1_Prompt_Engineering.md': `# I1 Prompt Engineering`,
  'content/courses/executive-ai-training/tier-3-verticals/module.json': `{ "title": "Verticals" }`,
  'content/handouts/F1_AI_Decision_Framework.md': `# F1 AI Decision Framework`,
  'content/handouts/F1_AI_Terminology_Cheat_Sheet.md': `# F1 AI Terminology Cheat Sheet`,
  'content/handouts/F2_AI_Acceptable_Use_Policy_Template.md': `# F2 AI Acceptable Use Policy Template`,
  'content/handouts/F2_AI_Risk_Register_Template.md': `# F2 AI Risk Register Template`,
  'content/handouts/F2_AI_Vendor_Checklist.md': `# F2 AI Vendor Checklist`,
  'content/handouts/F3_Readiness_Assessment_Scorecard.md': `# F3 Readiness Assessment Scorecard`,
  'content/handouts/F3_Pilot_Planning_Template.md': `# F3 Pilot Planning Template`,
  'content/handouts/F3_ROI_Calculator.md': `# F3 ROI Calculator`,
  'scripts/seed-content.ts': `// TODO: Implement Bulk import MD -> DB
export const seed = async () => {};`,
  'scripts/generate-types.ts': `// TODO: Implement Supabase type generation
export const generate = async () => {};`,
  'public/manifest.json': `{
  "name": "Tripwire AI Academy",
  "short_name": "TW Academy",
  "description": "Executive AI Training Platform",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#00ffff",
  "orientation": "any",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`,
  'public/sw.js': `// TODO: Implement Service worker
console.log('Service Worker');`,
  'public/icons/icon-192.png': ``,
  'public/icons/icon-512.png': ``,
  'public/icons/icon-maskable.png': ``,
  'public/og-image.png': ``,
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Files generated successfully.');
