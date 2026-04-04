#!/bin/sh

# Reemplaza las variables de entorno en los archivos JS compilados
for file in /app/dist/assets/*.js; do
    if [ -f "$file" ]; then
        sed -i "s|__VITE_BACKEND_BASE_URL__|${VITE_BACKEND_BASE_URL}|g" "$file"
    fi
done

exec "$@"