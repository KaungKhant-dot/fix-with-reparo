import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteNotice,
  emptyNotice,
  saveNotice,
  toggleNoticeStatus,
  useAdminState,
  type Notice,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/notices")({
  component: AdminNoticesPage,
});

function AdminNoticesPage() {
  const state = useAdminState();
  const [editing, setEditing] = useState<Notice | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Notice | null>(null);

  const notices = [...state.notices].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Notice Board</h2>
          <p className="text-xs text-muted-foreground">
            Published notices appear in the customer notification area.
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setEditing(emptyNotice())}>
          <Plus className="size-4" /> Create notice
        </Button>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <article
            key={n.id}
            className={`card-soft p-4 ${n.important ? "border-l-4 border-l-accent" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{n.title}</h3>
                  {n.important && (
                    <span className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
                      <AlertTriangle className="size-3" /> Important
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      n.status === "published"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {n.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.content}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">{n.date}</p>
              </div>

              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Publish or unpublish"
                  onClick={() => {
                    toggleNoticeStatus(n.id);
                    toast.success(
                      n.status === "published" ? "Notice moved to draft." : "Notice published successfully.",
                    );
                  }}
                >
                  <Send className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(n)}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setPendingDelete(n)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </article>
        ))}
        {notices.length === 0 && (
          <p className="card-soft px-4 py-10 text-center text-sm text-muted-foreground">
            No notices yet. Create your first announcement.
          </p>
        )}
      </div>

      <NoticeFormDialog
        key={editing?.id || (editing ? "new" : "closed")}
        notice={editing}
        onClose={() => setEditing(null)}
      />

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this notice?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) deleteNotice(pendingDelete.id);
                setPendingDelete(null);
                toast.success("Notice deleted successfully.");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type NoticeErrors = { title?: string; content?: string; date?: string };

function NoticeFormDialog({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  const [draft, setDraft] = useState<Notice | null>(notice);
  const [errors, setErrors] = useState<NoticeErrors>({});
  const current = draft;
  const set = (patch: Partial<Notice>) => current && setDraft({ ...current, ...patch });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const next: NoticeErrors = {};
    if (!current.title.trim()) next.title = "Title is required.";
    if (!current.content.trim()) next.content = "Content is required.";
    if (!current.date || Number.isNaN(new Date(current.date).getTime())) next.date = "Enter a valid date.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    saveNotice({ ...current, title: current.title.trim() });
    toast.success(
      current.status === "published" ? "Notice published successfully." : "Notice saved as draft.",
    );
    onClose();
  };

  return (
    <Dialog open={Boolean(notice)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{current?.id ? "Edit notice" : "Create notice"}</DialogTitle>
          <DialogDescription>Only published notices are visible to customers.</DialogDescription>
        </DialogHeader>

        {current && (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input value={current.title} onChange={(e) => set({ title: e.target.value })} />
              {errors.title && <p className="text-[11px] text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <Textarea
                rows={5}
                value={current.content}
                onChange={(e) => set({ content: e.target.value })}
              />
              {errors.content && <p className="text-[11px] text-destructive">{errors.content}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Image URL (optional)</Label>
              <Input value={current.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={current.date} onChange={(e) => set({ date: e.target.value })} />
              {errors.date && <p className="text-[11px] text-destructive">{errors.date}</p>}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="notice-published" className="text-sm">
                Published
              </Label>
              <Switch
                id="notice-published"
                checked={current.status === "published"}
                onCheckedChange={(v) => set({ status: v ? "published" : "draft" })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2.5">
              <Label htmlFor="notice-important" className="text-sm">
                Mark as important
              </Label>
              <Switch
                id="notice-important"
                checked={current.important}
                onCheckedChange={(v) => set({ important: v })}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="rounded-full">
                Save notice
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
