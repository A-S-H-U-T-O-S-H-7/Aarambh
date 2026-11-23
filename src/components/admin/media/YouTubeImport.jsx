"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, Search, CheckCircle2, Square } from "lucide-react";
import { toast } from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { getExistingMediaVideoIds, importYouTubeMedia, MEDIA_CATEGORIES } from "@/lib/services/mediaService";

const PAGE_SIZE = 200; // preview rows rendered at a time
const DEFAULT_CHANNEL = "https://www.youtube.com/channel/UCfc5omuZ4Sdq0LamkT8Hrqw";
const DEFAULT_FROM = "2023-10-22";
const DEFAULT_TO = "2026-05-30";

export default function YouTubeImport() {
  const { theme } = useThemeStore();
  const dark = theme === "dark";
  const { log } = useActivityLogger();
  const router = useRouter();

  // Prefilled for the Aarambh TV channel back-catalogue; the admin can change any of these
  const [source, setSource] = useState(DEFAULT_CHANNEL);
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("published");
  const [mediaType, setMediaType] = useState("video");
  const categories = MEDIA_CATEGORIES;

  const [fetching, setFetching] = useState(false);
  const [channelTitle, setChannelTitle] = useState("");
  const [videos, setVideos] = useState([]); // preview rows
  const [selected, setSelected] = useState(new Set());
  const [existing, setExisting] = useState(new Set());

  const [scan, setScan] = useState({ scanned: 0, found: 0, checking: false });
  const stopRef = useRef(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState(null);

  const input = `w-full px-3 py-2 rounded-xl border-2 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none ${
    dark ? "bg-gray-800/50 border-gray-700 text-gray-100 focus:border-yellow-500" : "bg-white border-gray-200 text-gray-800 focus:border-yellow-400"
  }`;
  const primaryBtn =
    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold cursor-pointer hover:shadow-lg disabled:opacity-60";
  const label = `block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`;
  const card = `rounded-xl border p-4 sm:p-5 ${dark ? "bg-gray-800/60 border-gray-700" : "bg-white border-gray-200"}`;

  const handleFetch = async () => {
    if (!source.trim()) return toast.error("Paste the channel or playlist link");
    if (from && to && from > to) return toast.error("'From' date must be before 'To' date");

    setFetching(true);
    setResult(null);
    setVideos([]);
    setSelected(new Set());
    setVisibleCount(PAGE_SIZE);
    setScan({ scanned: 0, found: 0, checking: false });
    stopRef.current = false;

    const all = [];
    let pageToken = "";
    let playlistId = null;
    try {
      // The server scans the channel in slices; keep asking until the range is covered
      do {
        const res = await fetch("/api/youtube-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source, from, to, pageToken, playlistId }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch videos");

        if (data.channelTitle) setChannelTitle(data.channelTitle);
        playlistId = data.playlistId;
        pageToken = data.done ? "" : data.nextPageToken;
        all.push(...data.videos);
        setScan((s) => ({ ...s, scanned: s.scanned + data.scanned, found: all.length }));
        setVideos([...all]);
      } while (pageToken && !stopRef.current);

      setScan((s) => ({ ...s, checking: true }));
      const ids = await getExistingMediaVideoIds(all.map((v) => v.videoId));
      setExisting(ids);
      setSelected(new Set(all.filter((v) => !ids.has(v.videoId)).map((v) => v.videoId)));

      if (all.length === 0) toast("No public videos found in this date range");
      else if (stopRef.current) toast("Stopped - showing what was found so far");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setScan((s) => ({ ...s, checking: false }));
      setFetching(false);
    }
  };

  const stats = useMemo(() => {
    const shorts = videos.filter((v) => v.videoType === "short").length;
    return {
      total: videos.length,
      standard: videos.length - shorts,
      shorts,
      existing: videos.filter((v) => existing.has(v.videoId)).length,
    };
  }, [videos, existing]);

  const filtered = useMemo(
    () => (typeFilter === "all" ? videos : videos.filter((v) => v.videoType === typeFilter)),
    [videos, typeFilter]
  );
  const importable = filtered.filter((v) => !existing.has(v.videoId));
  const allSelected = importable.length > 0 && importable.every((v) => selected.has(v.videoId));

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Select / clear everything in the current filter (Videos / Shorts / All)
  const toggleAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      importable.forEach((v) => (allSelected ? next.delete(v.videoId) : next.add(v.videoId)));
      return next;
    });

  const selectOnly = (type) =>
    setSelected(
      new Set(
        videos
          .filter((v) => !existing.has(v.videoId) && (type === "all" || v.videoType === type))
          .map((v) => v.videoId)
      )
    );

  const setType = (id, videoType) =>
    setVideos((prev) =>
      prev.map((v) =>
        v.videoId === id
          ? {
              ...v,
              videoType,
              youtubeUrl:
                videoType === "standard"
                  ? `https://www.youtube.com/watch?v=${id}`
                  : `https://www.youtube.com/shorts/${id}`,
            }
          : v
      )
    );

  const handleImport = async () => {
    const chosen = videos.filter((v) => selected.has(v.videoId) && !existing.has(v.videoId));
    if (chosen.length === 0) return toast.error("Select at least one video");

    setImporting(true);
    setProgress({ done: 0, total: chosen.length });
    const res = await importYouTubeMedia(chosen, { category, status, mediaType }, (done, total) =>
      setProgress({ done, total })
    );
    setImporting(false);

    if (res.success) {
      setResult(res);
      if (res.imported > 0) {
        await log({
          action: "CREATE",
          entityType: "media",
          entityId: "youtube-import",
          entityTitle: `${res.imported} videos imported from YouTube`,
          details: `Imported ${res.imported} YouTube videos as ${mediaType} (category: ${category || "none"}, status: ${status})`,
        });
      }
      toast.success(`${res.imported} videos imported`);
      const ids = new Set(existing);
      chosen.forEach((v) => ids.add(v.videoId));
      setExisting(ids);
      setSelected(new Set());
    } else {
      toast.error(res.error || "Import failed");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/media")}
          aria-label="Back to media"
          className={`mt-0.5 p-2 rounded-xl border-2 border-yellow-500/30 cursor-pointer hover:bg-yellow-500/10 ${
            dark ? "text-yellow-400" : "text-yellow-600"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-gray-100" : "text-gray-800"}`}>Import from YouTube</h1>
          <p className={`text-sm mt-1 ${dark ? "text-gray-300" : "text-gray-600"}`}>
            Bring Aarambh TV videos from YouTube into the Media Library in one go. Videos already on the site are skipped.
          </p>
        </div>
      </div>

      {/* Step 1 - source */}
      <div className={card}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_170px_170px_auto] gap-3 items-end">
          <div>
            <label className={label}>Channel or playlist link</label>
            <input
              className={input}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="https://www.youtube.com/channel/UC... or @handle or playlist URL"
            />
          </div>
          <div>
            <label className={label}>From</label>
            <input type="date" className={input} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className={label}>To</label>
            <input type="date" className={input} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          {fetching ? (
            <button
              onClick={() => (stopRef.current = true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium cursor-pointer"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={handleFetch}
              className={primaryBtn}
            >
              <Search className="w-4 h-4" />
              Fetch videos
            </button>
          )}
        </div>
        {fetching && (
          <p className={`mt-3 flex items-center gap-2 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            {scan.checking
              ? `Checking which of ${scan.found} videos are already on the site...`
              : `Scanned ${scan.scanned} uploads, ${scan.found} in your date range so far...`}
          </p>
        )}
      </div>

      {videos.length > 0 && (
        <>
          {/* Step 2 - options */}
          <div className={card}>
            <p className={`text-sm mb-4 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              {channelTitle && <strong>{channelTitle}: </strong>}
              {stats.total} videos found — {stats.standard} videos, {stats.shorts} shorts
              {stats.existing > 0 && `, ${stats.existing} already on the site`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
              <div>
                <label className={label}>Save as</label>
                <select className={`${input} cursor-pointer`} value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
                  <option value="video">Video</option>
                  <option value="bhajan">Bhajan</option>
                </select>
              </div>
              <div>
                <label className={label}>Category (for all)</label>
                <select className={`${input} cursor-pointer`} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Status</label>
                <select className={`${input} cursor-pointer`} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="published">Publish now</option>
                  <option value="draft">Save as draft</option>
                </select>
              </div>
              <button
                onClick={handleImport}
                disabled={importing || selected.size === 0}
                className={primaryBtn}
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {importing ? `Importing ${progress.done}/${progress.total}...` : `Import ${selected.size} selected`}
              </button>
            </div>
            {result && (
              <p className="mt-4 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                {result.imported} imported{result.skipped ? `, ${result.skipped} skipped (already on site)` : ""}.
                <button onClick={() => router.push("/admin/media")} className="underline cursor-pointer">
                  View media library
                </button>
              </p>
            )}
          </div>

          {/* Step 3 - preview */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
              {[
                ["all", `All (${stats.total})`],
                ["standard", `Videos (${stats.standard})`],
                ["short", `Shorts (${stats.shorts})`],
              ].map(([value, text]) => (
                <button
                  key={value}
                  onClick={() => {
                    setTypeFilter(value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
                    typeFilter === value
                      ? "bg-yellow-500 text-gray-900"
                      : dark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
            <div className={`flex flex-wrap items-center gap-3 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
              <span>{selected.size} selected</span>
              <button onClick={() => selectOnly("all")} className="underline cursor-pointer">Select all</button>
              <button onClick={() => selectOnly("standard")} className="underline cursor-pointer">Only videos</button>
              <button onClick={() => selectOnly("short")} className="underline cursor-pointer">Only shorts</button>
              <button onClick={() => setSelected(new Set())} className="underline cursor-pointer">Clear</button>
            </div>
          </div>

          <div className={`${card} p-0 sm:p-0 overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={dark ? "bg-gray-900/60 text-gray-300" : "bg-gray-50 text-gray-600"}>
                  <tr>
                    <th className="p-3 w-10">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} className="cursor-pointer" aria-label="Select all" />
                    </th>
                    <th className="p-3 text-left">Video</th>
                    <th className="p-3 text-left whitespace-nowrap">Upload date</th>
                    <th className="p-3 text-left">Duration</th>
                    <th className="p-3 text-left">Type</th>
                  </tr>
                </thead>
                <tbody className={dark ? "divide-y divide-gray-700" : "divide-y divide-gray-100"}>
                  {filtered.slice(0, visibleCount).map((v) => {
                    const onSite = existing.has(v.videoId);
                    return (
                      <tr key={v.videoId} className={onSite ? "opacity-50" : ""}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            disabled={onSite}
                            checked={!onSite && selected.has(v.videoId)}
                            onChange={() => toggle(v.videoId)}
                            className="cursor-pointer"
                            aria-label={`Select ${v.title}`}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3 min-w-[260px]">
                            <img src={v.thumbnail} alt="" loading="lazy" className="w-24 aspect-video object-cover rounded flex-shrink-0" />
                            <div className="min-w-0">
                              <a
                                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-medium line-clamp-2 hover:underline ${dark ? "text-gray-100" : "text-gray-900"}`}
                              >
                                {v.title}
                              </a>
                              {onSite && <span className="text-xs text-green-600">Already on site</span>}
                            </div>
                          </div>
                        </td>
                        <td className={`p-3 whitespace-nowrap ${dark ? "text-gray-300" : "text-gray-600"}`}>{v.publishDate}</td>
                        <td className={`p-3 ${dark ? "text-gray-300" : "text-gray-600"}`}>{v.duration}</td>
                        <td className="p-3">
                          <select
                            value={v.videoType}
                            disabled={onSite}
                            onChange={(e) => setType(v.videoId, e.target.value)}
                            className={`px-2 py-1 rounded border text-xs cursor-pointer ${
                              dark ? "bg-gray-800 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-700"
                            }`}
                          >
                            <option value="standard">Video</option>
                            <option value="short">Short</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > visibleCount && (
              <div className="p-3 text-center">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className={`text-sm font-medium underline cursor-pointer ${dark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Show more ({filtered.length - visibleCount} more in list)
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
