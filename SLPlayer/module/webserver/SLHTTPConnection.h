
#import "HTTPConnection.h"
#import <CVCocoaHTTPServer/HTTPConnection.h>
#import <CVCocoaHTTPServer/HTTPServer.h>

@class MultipartFormDataParser;

@interface SLHttpServer : NSObject

+ (void)start;
+ (void)stop;

@end

@interface SLHTTPConnection : HTTPConnection  {
    MultipartFormDataParser*        parser;
	NSFileHandle*					storeFile;
	
	NSMutableArray*					uploadedFiles;
}

@end
