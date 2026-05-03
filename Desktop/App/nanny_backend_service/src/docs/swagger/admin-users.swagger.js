/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: integer }
 *         mobile: { type: string }
 *         role: { type: string, enum: [user, nanny, admin] }
 *         is_verified: { type: boolean }
 *         is_active: { type: boolean }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     UserCreateRequest:
 *       type: object
 *       required: [mobile]
 *       properties:
 *         mobile: { type: string }
 *         role: { type: string, enum: [user, nanny, admin] }
 *         is_verified: { type: boolean }
 *         is_active: { type: boolean }
 *     UserListResponse:
 *       type: object
 *       properties:
 *         status: { type: string }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             pagination:
 *               type: object
 *
 * /api/admin/users:
 *   post:
 *     tags: [Admin Users]
 *     summary: Create user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Duplicate mobile
 *   get:
 *     tags: [Admin Users]
 *     summary: List users with pagination and mobile search (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: is_active
 *         schema: { type: string, enum: [true, false] }
 *       - in: query
 *         name: mobile
 *         description: Partial match on users.mobile
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List result
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/admin/users/{id}:
 *   get:
 *     tags: [Admin Users]
 *     summary: Get user by id (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   patch:
 *     tags: [Admin Users]
 *     summary: Partial update user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Not found
 *       409:
 *         description: Duplicate mobile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   put:
 *     tags: [Admin Users]
 *     summary: Update user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *       409:
 *         description: Duplicate mobile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     tags: [Admin Users]
 *     summary: Soft delete user and remove linked nanny rows (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deactivated; nannies removed
 *       400:
 *         description: Already inactive
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
