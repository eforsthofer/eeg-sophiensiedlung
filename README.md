# eeg-sophiensiedlung
Informationen zur Energiegemeinschaft Sophiensiedlung


# ssh Zugang zu github.com
https://docs.github.com/en/authentication/connecting-to-github-with-ssh
$ cat ~/.ssh/id_rsa.pub 
--> Settings, SSH, New ssh key

https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories#switching-remote-urls-from-https-to-ssh
$ git clone http://github.com/eforsthofer/eeg-sophiensiedlung
$ git remote -v
origin	https://github.com/eforsthofer/eeg-sophiensiedlung (fetch)
origin	https://github.com/eforsthofer/eeg-sophiensiedlung (push)

$ git remote set-url origin git@github.com:eforsthofer/eeg-sophiensiedlung.git

[eforstho@hpc-it07180 eeg-sophiensiedlung]$ git remote -v
origin	git@github.com:eforsthofer/eeg-sophiensiedlung.git (fetch)
origin	git@github.com:eforsthofer/eeg-sophiensiedlung.git (push)


