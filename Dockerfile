FROM nginx:alpine
COPY dist/frontend-inventarioDay/browser /usr/share/nginx/html
RUN sed -i 's/80/9090/g' /etc/nginx/conf.d/default.conf
EXPOSE 9090