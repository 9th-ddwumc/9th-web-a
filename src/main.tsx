// main.ts (선택 사항)
import { join } from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true, credentials: true });

  // 정적 파일 (프론트 빌드 결과 경로로 교체)
  app.useStaticAssets(join(process.cwd(), "client", "dist"));

  // SPA fallback: 서버 라우트가 없으면 index.html 반환
  const adapter = app.getHttpAdapter();
  adapter.get("*", (req: any, res: any) => {
    res.sendFile(join(process.cwd(), "client", "dist", "index.html"));
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
