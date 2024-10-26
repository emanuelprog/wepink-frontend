FROM nginx:alpine

COPY ./default.conf /etc/nginx/conf.d/default.conf

#COPY ./nginx.conf /et/nginx/nginx.conf
COPY /dist/maiscultura /usr/share/nginx/html

EXPOSE 4200
