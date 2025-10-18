var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 기본 파일(index.html) 자동 노출 + 정적파일 서빙
app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.PhysicalPath ?? "";
        if (path.EndsWith(".css") || path.EndsWith(".js") || path.EndsWith(".woff2"))
            ctx.Context.Response.Headers.CacheControl = "public, max-age=604800"; // 7일
        if (path.EndsWith(".json"))
            ctx.Context.Response.Headers.CacheControl = "public, max-age=86400";  // 1일
    }
});

Console.WriteLine("서버 구동 완료. 우리 행복한 개발자가 되자!");

// 서버에서 1~64 무작위 숫자 반환
app.MapGet("/api/roll", () => new { number = Random.Shared.Next(1, 65) });

app.Run();
