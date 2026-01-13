# Cloudflare worker stability

- Commit `ce7e8a83` is tagged `v1.0-stable` and contains the current Cloudflare worker implementation.
- Subsequent commits touching the worker (`0ee8120c`, `4d54c2b4`) only adjust terminology strings; `git diff ce7e8a83..HEAD -- index.ts` shows no behavioral changes.
- Later commits (`db6197e5`, `e7e854a5`) fixed the frontend/build wiring to point at the correct worker endpoint and inject the URL at deploy time, improving reliability rather than regressing it.
- As of `HEAD`, the worker code and wrangler configuration remain the same as in `v1.0-stable`, so `ce7e8a83` is not the last functional state; newer commits retain a functioning backend worker and include deployment fixes.
