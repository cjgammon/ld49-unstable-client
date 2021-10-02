branch=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD); 
if [ $branch = "main" ];
then webpack --env.name=prod && psg upload app.projectgeneva.com ./dist
elif [ $branch = "stage" ]
then webpack --env.name=stage && psg upload app-stage.projectgeneva.com ./dist
else 
webpack --env.patch --env.name=dev && psg upload app-develop.projectgeneva.com ./dist
fi;
