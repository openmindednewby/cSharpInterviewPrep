FROM nginx:alpine

# Use the custom nginx configuration provided by the study site
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Serve the prebuilt site from /webgl (matching nginx.conf root)
WORKDIR /webgl
COPY dist/ ./

# Include SEO + PWA metadata alongside the static build
COPY robots.txt ./robots.txt
COPY sitemap.xml ./sitemap.xml
COPY manifest.webmanifest ./manifest.webmanifest
