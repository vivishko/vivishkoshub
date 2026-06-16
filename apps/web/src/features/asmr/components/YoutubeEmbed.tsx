import type { YoutubeVideo } from "@/features/asmr/types";

type YoutubeEmbedProps = {
  video: YoutubeVideo;
};

function getYoutubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.replace("/", "");
    }

    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/")[2] ?? null;
    }

    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

export default function YoutubeEmbed({ video }: YoutubeEmbedProps) {
  const youtubeVideoId = getYoutubeVideoId(video.url);

  if (!youtubeVideoId) {
    return (
      <a className="asmr-video-link" href={video.url} rel="noreferrer" target="_blank">
        <span>{video.title}</span>
        <span>{video.channel}</span>
      </a>
    );
  }

  return (
    <article className="asmr-youtube-card">
      <iframe
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
        title={video.title}
      />
      <div>
        <h3>{video.title}</h3>
        <p>{video.channel}</p>
      </div>
    </article>
  );
}
