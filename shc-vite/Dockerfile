# EC2에서 이미 빌드했으므로 바로 nginx로 서빙
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
