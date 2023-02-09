def handleuploadfile(f):
    with open('base/static/multimedia/'+f.name,'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)