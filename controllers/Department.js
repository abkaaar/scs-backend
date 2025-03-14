const { PrismaClient } = require('@prisma/client');
const { asyncHandler } = require("../middlewares/error");

const prisma = new PrismaClient();

// Add Department
module.exports.addDepartment = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    try {
        const department = await prisma.department.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            data: department
        });
    } catch (error) {
        next(error);
    }
});

// Edit Department
module.exports.editDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const department = await prisma.department.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description || undefined
            }
        });

        res.status(200).json({
            success: true,
            message: 'Department updated successfully',
            data: department
        });
    } catch (error) {
        next(error);
    }
});

// Get All Departments
module.exports.getDepartments = asyncHandler(async (req, res, next) => {
    try {
        const departments = await prisma.department.findMany();
        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        next(error);
    }
});

// Get Single Department
module.exports.getDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const department = await prisma.department.findUnique({
            where: { id }
        });

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        next(error);
    }
});

// Delete Department
module.exports.deleteDepartment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        await prisma.department.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});
