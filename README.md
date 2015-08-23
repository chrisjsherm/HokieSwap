Swap App
=======

Swap App is a classifieds advertisement application written in C# and JavaScript on the .NET framework. 
There is an associated management application, [SwapAdmin](https://github.com/chrisjsherm/SwapAppAdmin), 
used for administering this application as well as a Microsoft Azure worker role, 
[SwapAppWorker](https://github.com/chrisjsherm/SwapAppWorker), for removing stale posts.

## Configuration

Swap App is configured to use Central Authentication Service (CAS) forms authentication. 
To use CAS authentication, you will need to add the configuration elements for ASP.NET 
Forms Authentication discussed in the [CAS documentation](https://wiki.jasig.org/display/casc/.net+cas+client) 
to [Web.config](MvcWebRole/Web.config) or use a transformation to insert them via a Web.Debug.config/Web.Release.config file.

Related to CAS, you will need to modify the application's authorization filtering in the FilterConfig.cs 
and WebApiConfig.cs files within [MvcWebRole/App_Start](MvcWebRole/App_Start) that currently contains roles specific to Virginia Tech.

To deploy the application to Azure, you must add a ServiceConfiguration.Cloud.cscfg file to the Cloud Service project.

This repository contains a submodule, [SwapEntities](SwapEntities), that needs to be initialized. After cloning 
this repository, run 'git submodule init' followed by 'git submodule update'.

## MIT License

Copyright 2014 Virginia Tech under the [MIT License](LICENSE).
