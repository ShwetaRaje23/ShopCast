//
//  Broadcast.swift
//  Todos
//
//  Created by Nikhil Bhanu on 3/29/16.
//  Copyright © 2016 Martijn Walraven. All rights reserved.
//

import CoreData

class Broadcast: NSManagedObject {
    @NSManaged var place: String!
    @NSManaged var items: String!
    @NSManaged var time: String!
    @NSManaged var charge: String!
    @NSManaged var isDropoff: String!
    @NSManaged var userId: String!
    @NSManaged var casterEmail: String!
    @NSManaged var casterName: String!
    @NSManaged var checked: Bool
    @NSManaged var list: List!
}