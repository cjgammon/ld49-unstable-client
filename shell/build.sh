branch=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD); 
if [ $branch = "main" ];
then webpack --env.minor --env.name=prod
elif [ $branch = "stage" ]
then webpack --env.name=stage
else 
webpack --env.name=dev
fi;
