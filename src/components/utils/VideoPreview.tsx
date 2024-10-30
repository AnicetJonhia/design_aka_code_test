import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// @ts-ignore
const VideoPreview = ({ fileURL }) => (
  <Dialog>
    <DialogTrigger asChild>
      <video
        src={fileURL}
        poster
        className="w-28 h-28 cursor-pointer rounded"
        onClick={(e) => e.stopPropagation()}
        muted
      />
    </DialogTrigger>
    <DialogContent className="p-10 max-w-screen-lg">
      <video src={fileURL} controls autoPlay className="w-full h-auto" />
    </DialogContent>
  </Dialog>
);

export default VideoPreview;
