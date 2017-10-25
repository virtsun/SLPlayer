//
//  NSDictionary+NilSafe.m
//  NSDictionary-NilSafe
//
//  Created by Allen Hsu on 6/22/16.
//  Copyright © 2016 Glow Inc. All rights reserved.
//

#import <objc/runtime.h>
#import "NSDictionary+NilSafe.h"
#import "NSObject+Swizzling.h"

static BOOL disableSafeGuard = NO;

@implementation NSDictionary (NilSafe)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self swizzleSelector:@selector(initWithObjects:forKeys:count:) withSwizzledSelector:@selector(gl_initWithObjects:forKeys:count:)];
        
        [self swizzleClassSelector:@selector(dictionaryWithObjects:forKeys:count:) withSwizzledSelector:@selector(gl_dictionaryWithObjects:forKeys:count:)];
    });
}

+ (instancetype)gl_dictionaryWithObjects:(const id [])objects forKeys:(const id<NSCopying> [])keys count:(NSUInteger)cnt {

    if(disableSafeGuard){
        return [self gl_dictionaryWithObjects:objects forKeys:keys count:cnt];
    }

    id safeObjects[cnt];
    id safeKeys[cnt];
    NSUInteger j = 0;
    for (NSUInteger i = 0; i < cnt; i++) {
        id key = keys[i];
        id obj = objects[i];
        if (!key) {
            continue;
        }
        if (!obj) {
            obj = [NSNull null];
        }
        safeKeys[j] = key;
        safeObjects[j] = obj;
        j++;
    }
    return [self gl_dictionaryWithObjects:safeObjects forKeys:safeKeys count:j];
}

- (instancetype)gl_initWithObjects:(const id [])objects forKeys:(const id<NSCopying> [])keys count:(NSUInteger)cnt {

    if (disableSafeGuard){
        return [self gl_initWithObjects:objects forKeys:keys count:cnt];
    }

    id safeObjects[cnt];
    id safeKeys[cnt];
    NSUInteger j = 0;
    for (NSUInteger i = 0; i < cnt; i++) {
        id key = keys[i];
        id obj = objects[i];
        if (!key) {
            continue;
        }
        if (!obj) {
            obj = [NSNull null];
        }
        safeKeys[j] = key;
        safeObjects[j] = obj;
        j++;
    }
    return [self gl_initWithObjects:safeObjects forKeys:safeKeys count:j];
}

+ (void)disableSafeGuard:(BOOL)disable{
    disableSafeGuard = disable;
}


@end

@implementation NSMutableDictionary (NilSafe)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = NSClassFromString(@"__NSDictionaryM");
        
        [class swizzleSelector:@selector(setObject:forKey:)
          withSwizzledSelector:@selector(gl_setObject:forKey:)];
        
        [class swizzleSelector:@selector(setObject:forKeyedSubscript:)
          withSwizzledSelector:@selector(gl_setObject:forKeyedSubscript:)];
    });
}

- (void)gl_setObject:(id)anObject forKey:(id<NSCopying>)aKey {
    if(disableSafeGuard){
        [self gl_setObject:anObject forKey:aKey];
        return;
    }
    if (!aKey) {
        return;
    }
    if (!anObject) {
        anObject = [NSNull null];
    }
    [self gl_setObject:anObject forKey:aKey];
}

- (void)gl_setObject:(id)obj forKeyedSubscript:(id<NSCopying>)key {

    if (disableSafeGuard){
        [self gl_setObject:obj forKeyedSubscript:key];
        return;
    }

    if (!key) {
        return;
    }
    if (!obj) {
        obj = [NSNull null];
    }
    [self gl_setObject:obj forKeyedSubscript:key];
}

@end

@implementation NSNull (NilSafe)


+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        [self swizzleSelector:@selector(methodSignatureForSelector:)
         withSwizzledSelector:@selector(gl_methodSignatureForSelector:)];
      
        [self swizzleSelector:@selector(forwardInvocation:)
         withSwizzledSelector:@selector(gl_forwardInvocation:)];
    });
}

- (NSMethodSignature *)gl_methodSignatureForSelector:(SEL)aSelector {
    NSMethodSignature *sig = [self gl_methodSignatureForSelector:aSelector];
    if (sig) {
        return sig;
    }
    return [NSMethodSignature signatureWithObjCTypes:@encode(void)];
}

- (void)gl_forwardInvocation:(NSInvocation *)anInvocation {
    NSUInteger returnLength = [[anInvocation methodSignature] methodReturnLength];
    if (!returnLength) {
        // nothing to do
        return;
    }
    // set return value to all zero bits
    char buffer[returnLength];
    memset(buffer, 0, returnLength);

    [anInvocation setReturnValue:buffer];
}

@end
