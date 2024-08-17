import { bucket } from "./firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

export const fileUploadToStorage = async (
  buffer: Buffer,
  filePath: string,
  contentType: string
) => {
  try {
    const fileExtension =
      contentType === "audio/mpeg" ? "mp3" : contentType.split("/")[1];
    const randomFileName = uuidv4();
    const fileName = `${filePath}/${randomFileName}.${fileExtension}`;
    const uploadFile = bucket.file(fileName);

    await uploadFile.save(buffer, {
      metadata: {
        contentType: contentType,
      },
    });

    await uploadFile.makePublic();
    // https://storage.googleapis.com/[バケット名]/[ファイル名]
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error: any) {
    console.log(error);
    throw new Error("ファイルのアップロードに失敗しました。", error.message);
  }
};
