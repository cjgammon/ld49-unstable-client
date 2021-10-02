branch=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD); 
if [ $branch = "main" ]
then webpack-dev-server --hot --env.name=prod
elif [ $branch = "stage" ]
then webpack-dev-server --hot --env.name=stage
else 
webpack-dev-server --hot
fi;