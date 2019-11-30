//
//  Errors.swift
//  
//
//  Created by Stefan Romanescu on 30/11/2019.
//

import Foundation

public enum Errors: Error {
    case FileNotFound(path: String)
    case CouldNotDecode
    case CouldNotTransformToData
}
